import { Dynamic, DynamicProps } from 'solid-js/web';
import { TransitionGroup } from 'solid-transition-group';
import { createEffect, createSignal, For, type ValidComponent } from 'solid-js';

import { bem } from '@/css/bem.js';
import { composeHandlers } from '@/helpers/composeHandlers.js';
import { cnCreate } from '@/css/cnCreate.js';
import type { WithOptionalClasses } from '@/css/types.js';

import './Tappable.scss';

export type TappableElementKey = 'root' | 'ripples' | 'ripple';
export type TappableProps<C extends ValidComponent> =
  & DynamicProps<C>
  & WithOptionalClasses<TappableElementKey, TappableProps<C>>;

const [b, e] = bem('tgui-tappable');

export function Tappable<T extends ValidComponent>(props: TappableProps<T>) {
  const [$ripples, setRipples] = createSignal<[x: number, y: number, canDestroy?: boolean][]>([]);
  const [$isHolding, setIsHolding] = createSignal(false);
  const $cn = cnCreate(props as TappableProps<ValidComponent>, {
    root: v => [v.class, b()],
    ripples: e('ripples'),
    ripple: e('ripple'),
  });

  createEffect(() => {
    const r = $ripples();
    // To modify ripples array, we have to check the following:
    // 1. Ripples array is not empty.
    // 2. Ripples array contains more than 1 element (so we can start removing at least something)
    // or the user is not holding the pointer (so we can probably remove everything).
    // 3. A tailed ripple is ready to be removed. This makes sure, we have at least something
    // to remove.
    if (r.length && (r.length !== 1 || !$isHolding()) && r[0][2]) {
      setRipples(ripples => {
        return ripples.filter((item, idx, arr) => {
          return !item[2] || ($isHolding() && idx === arr.length - 1);
        });
      });
    }
  });

  return (
    <Dynamic
      {...props}
      class={$cn().root}
      onPointerDown={composeHandlers<T, PointerEvent>(props.onPointerDown, e => {
        const { currentTarget } = e;
        if (currentTarget instanceof HTMLElement) {
          const rect = currentTarget.getBoundingClientRect();
          setRipples(prev => [...prev, [
            e.clientX - rect.left,
            e.clientY - rect.top,
          ]]);
        }
        setIsHolding(true);
      })}
      onPointerUp={composeHandlers<T, PointerEvent>(props.onPointerUp, () => {
        setIsHolding(false);
      })}
      onPointerLeave={composeHandlers<T, PointerEvent>(props.onPointerLeave, () => {
        setIsHolding(false);
      })}
    >
      {props.children}
      <span class={$cn().ripples}>
        <TransitionGroup
          onEnter={(el, done) => {
            return el
              .animate(
                {
                  transform: ['scale(0) translate(-50%,-50%)', 'scale(1) translate(-50%,-50%)'],
                  opacity: [0.1, 0.2],
                },
                { duration: 550, easing: 'ease-in-out', fill: 'forwards' },
              )
              .finished
              .then(done)
              .then(() => {
                // Mark the first element not marked as destroyable to remove when possible.
                setRipples(ripples => {
                  for (const ripple of ripples) {
                    if (!ripple[2]) {
                      ripple[2] = true;
                      return [...ripples];
                    }
                  }
                  return ripples;
                });
              });
          }}
          onExit={(el, done) => {
            return el
              .animate({ opacity: [0.2, 0] }, { duration: 400 })
              .finished
              .then(done);
          }}
        >
          <For each={$ripples()}>
            {ripple => (
              <span class={$cn().ripple} style={`left:${ripple[0]}px; top:${ripple[1]}px`}/>
            )}
          </For>
        </TransitionGroup>
      </span>
    </Dynamic>
  );
}
