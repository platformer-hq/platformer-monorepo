import { type JSX, Show } from 'solid-js';

import type { WithOptionalClasses } from '@/css/types.js';
import { bem } from '@/css/bem.js';
import { pickProps } from '@/helpers/pickProps.js';
import { CheckmarkIOS28, Xmark24 } from '@/icons/index.js';
import { omitProps } from '@/helpers/omitProps.js';
import { cnCreate } from '@/css/cnCreate.js';

import './SwitchIos.scss';

export type SwitchIosElementKey = 'root' | 'input' | 'thumb' | 'checkIcon' | 'uncheckIcon';
export type SwitchIosProps =
  & WithOptionalClasses<SwitchIosElementKey, SwitchIosProps>
  & JSX.IntrinsicElements['input']
  & {
  /**
   * Should icons inside the thumb be displayed. Enabling this mode will also slightly modify
   * the switch colors.
   * @default false
   */
  iconed?: boolean;
};

const [b, e] = bem('tgui-switch-ios');

export function SwitchIos(props: SwitchIosProps) {
  const $cn = cnCreate(props, {
    root: v => [v.class, b(pickProps(v, ['checked', 'disabled', 'iconed']))],
    input: e('input'),
    thumb: v => e('thumb', pickProps(v, ['checked'])),
    checkIcon: e('check-icon'),
    uncheckIcon: e('uncheck-icon'),
  });

  return (
    <label class={$cn().root}>
      <input {...omitProps(props, ['classes'])} class={$cn().input} type="checkbox"/>
      <span class={$cn().thumb}>
        <Show when={props.iconed}>
          <Show
            when={props.checked}
            fallback={<Xmark24 width="auto" height={20} class={$cn().uncheckIcon}/>}
          >
            <CheckmarkIOS28 width="auto" height={20} class={$cn().checkIcon}/>
          </Show>
        </Show>
      </span>
    </label>
  );
}