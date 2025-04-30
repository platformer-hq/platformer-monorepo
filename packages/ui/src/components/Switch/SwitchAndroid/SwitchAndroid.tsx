import { bem } from '@/css/bem.js';
import { pickProps } from '@/helpers/pickProps.js';
import { cnCreate } from '@/css/cnCreate.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import './SwitchAndroid.scss';

export type SwitchAndroidElementKey = 'root' | 'input' | 'thumb' | 'checkIcon' | 'uncheckIcon';
export type SwitchAndroidProps =
  & WithOptionalClasses<SwitchAndroidElementKey, SwitchAndroidProps>
  & JSXIntrinsicElementAttrs<'input'>;

const [b, e] = bem('tgui-switch-android');

export function SwitchAndroid(props: SwitchAndroidProps) {
  const $cn = cnCreate(props, {
    root: v => [v.class, b(pickProps(v, ['checked', 'disabled']))],
    input: e('input'),
    thumb: v => e('thumb', pickProps(v, ['checked'])),
  });

  return (
    <label class={$cn().root}>
      <input {...omitClasses(props)} class={$cn().input} type="checkbox"/>
      <span class={$cn().thumb}/>
    </label>
  );
}