import { For } from 'solid-js';

import { bem } from '@/css/bem.js';
import { cnCreate } from '@/css/cnCreate.js';
import { omitProps } from '@/helpers/omitProps.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import './LoadingIndicatorIos.scss';

export type LoadingIndicatorIosElementKey = 'root' | 'particle';
export type LoadingIndicatorIosProps =
  & JSXIntrinsicElementAttrs<'span'>
  & WithOptionalClasses<LoadingIndicatorIosElementKey, LoadingIndicatorIosProps>
  & {
  size: number;
};

const [b, e] = bem('tgui-loading-indicator-ios');

export function LoadingIndicatorIos(props: LoadingIndicatorIosProps) {
  const $cn = cnCreate(props, {
    root: v => [b(), v.class],
    particle: e('particle'),
  });
  const $style = () => {
    const { style, size } = props;
    const cssSize = `${size}px`;
    return typeof style === 'string' ? `${style};height:${cssSize}` : {
      ...style,
      height: cssSize,
    };
  };

  return (
    <span {...omitProps(props, ['size'])} style={$style()} class={$cn().root}>
      <For each={new Array(8).fill(null)}>
        {(_, index) => (
          <span
            class={$cn().particle}
            style={{
              'animation-delay': `${125 * index()}ms`,
              transform: `rotate(${45 * index()}deg) translate3d(0, -125%, 0)`,
            }}
          />
        )}
      </For>
    </span>
  );
}
