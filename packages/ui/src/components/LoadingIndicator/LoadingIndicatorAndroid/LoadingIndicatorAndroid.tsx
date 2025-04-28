import { bem } from '@/css/bem.js';

import { cnCreate } from '@/css/cnCreate.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import { omitProps } from '@/helpers/omitProps.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';
import type { WithOptionalClasses } from '@/css/types.js';

import './LoadingIndicatorAndroid.scss';

const [b, e] = bem('tgui-loading-indicator-android');

export type LoadingIndicatorAndroidElementKey = 'root' | 'icon' | 'circle';
export type LoadingIndicatorAndroidProps =
  & JSXIntrinsicElementAttrs<'span'>
  & WithOptionalClasses<LoadingIndicatorAndroidElementKey, LoadingIndicatorAndroidProps>
  & {
  size: number;
};

export function LoadingIndicatorAndroid(props: LoadingIndicatorAndroidProps) {
  const $cn = cnCreate(props, {
    root: v => [b(), v.class],
    icon: e('icon'),
    circle: e('circle'),
  });
  return (
    <span {...omitProps(omitClasses(props), ['size'])} class={$cn().root}>
      <svg class={$cn().icon} width={props.size} height={props.size}>
        <circle
          class={$cn().circle}
          cx="50%"
          cy="50%"
          r="50%"
          stroke-linecap="round"
          stroke="currentcolor"
        />
      </svg>
    </span>
  );
}