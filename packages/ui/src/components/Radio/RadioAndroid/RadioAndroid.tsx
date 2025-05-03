import { createEffect, type JSX, mergeProps, on } from 'solid-js';

import { omitProps } from '@/helpers/omitProps.js';

import { bem } from '@/css/bem.js';
import { accessor } from '@/helpers/accessor.js';
import { cnCreate } from '@/css/cnCreate.js';
import type { WithOptionalClasses } from '@/css/types.js';

import './RadioAndroid.scss';

export type RadioAndroidElementKey = 'root' | 'input' | 'inner';
export type RadioAndroidProps =
  & WithOptionalClasses<RadioAndroidElementKey, RadioAndroidProps & {
    initiallyChecked: boolean;
  }>
  & JSX.IntrinsicElements['input'];

const [b, e] = bem('tgui-radio-android');

export function RadioAndroid(props: RadioAndroidProps) {
  const $checked = accessor(props, 'checked');
  const $cn = cnCreate(
    mergeProps(props, { initiallyChecked: $checked() }),
    {
      root: v => [v.class, b(v.initiallyChecked && 'initially-checked')],
      input: e('input'),
      inner: v => e('inner', v.initiallyChecked && 'initially-checked'),
    },
  );
  const initiallyChecked = $checked();
  let rootRef: HTMLLabelElement | undefined;
  let innerRef: HTMLSpanElement | undefined;
  let rootAnimation: Animation | undefined;
  let innerAnimation: Animation | undefined;

  let isMounted = false;

  createEffect(on([$checked], () => {
    if (!isMounted) {
      isMounted = true;
      return;
    }
    if (!rootAnimation || !innerAnimation) {
      const uncheckedColor = 'var(--unchecked-color)';
      const checkedColor = 'var(--checked-color)'
      const animationOptions = {
        duration: 200,
        direction: initiallyChecked ? 'reverse' : 'normal',
        easing: 'linear',
        fill: 'both',
      } as const;
      rootAnimation = rootRef!.animate({
        transform: ['scale(1)', 'scale(0.8)', 'scale(1)'],
        padding: ['0px', '0px', '2px'],
        borderColor: [uncheckedColor, uncheckedColor, checkedColor],
      }, animationOptions);
      innerAnimation = innerRef!.animate({
        boxShadow: [
          `0 0 0 0 ${uncheckedColor} inset`,
          `0 0 0 8px ${uncheckedColor} inset`,
          `0 0 0 6px ${checkedColor} inset`,
        ],
        borderColor: [uncheckedColor, uncheckedColor, checkedColor],
      }, animationOptions);
    } else {
      rootAnimation.reverse();
      innerAnimation.reverse();
    }
  }));

  return (
    <label ref={rootRef} class={$cn().root}>
      <input {...omitProps(props, ['classes'])} class={$cn().input} type="radio"/>
      <span ref={innerRef} class={$cn().inner}/>
    </label>
  );
}
