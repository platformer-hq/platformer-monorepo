import { type JSX, mergeProps } from 'solid-js';

import { omitProps } from '@/helpers/omitProps.js';

import { bem } from '@/css/bem.js';
import { pickProps } from '@/helpers/pickProps.js';
import { cnCreate } from '@/css/cnCreate.js';
import { signalsToRecord } from '@/helpers/signalsToRecord.js';
import { useActiveStateHandler } from '@/hooks/useActiveStateHandler.js';
import { CheckmarkIOS28 } from '@/icons/index.js';
import type { WithOptionalClasses } from '@/css/types.js';

import './CheckboxAndroid.scss';

export type CheckboxAndroidElementKey = 'root' | 'input' | 'icon';
export type CheckboxAndroidProps =
  & WithOptionalClasses<CheckboxAndroidElementKey, CheckboxAndroidProps & { active: boolean }>
  & JSX.IntrinsicElements['input'];

const [b, e] = bem('tgui-checkbox-android');

export function CheckboxAndroid(props: CheckboxAndroidProps) {
  const [$active, onPointerDown] = useActiveStateHandler();
  const $cn = cnCreate(
    mergeProps(props, signalsToRecord({ active: $active })),
    {
      root: v => [v.class, b(pickProps(v, ['checked', 'active']))],
      input: e('input'),
      icon: v => e('icon', pickProps(v, ['checked'])),
    },
  );

  return (
    <label class={$cn().root} onPointerDown={onPointerDown}>
      <input {...omitProps(props, ['classes'])} class={$cn().input} type="checkbox"/>
      <CheckmarkIOS28 class={$cn().icon} size={19}/>
    </label>
  );
}
