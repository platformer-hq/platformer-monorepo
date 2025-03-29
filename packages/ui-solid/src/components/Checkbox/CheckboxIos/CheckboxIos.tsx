import { type JSX, mergeProps } from 'solid-js';

import { omitProps } from '@/helpers/omitProps.js';

import { bem } from '@/css/bem.js';
import { pickProps } from '@/helpers/pickProps.js';
import { cnCreate } from '@/css/cnCreate.js';
import { signalsToRecord } from '@/helpers/signalsToRecord.js';
import { useActiveStateHandler } from '@/hooks/useActiveStateHandler.js';
import { CheckmarkIOS28 } from '@/icons/index.js';
import type { WithOptionalClasses } from '@/css/types.js';

import './CheckboxIos.scss';

export type CheckboxIosElementKey = 'root' | 'input' | 'icon';
export type CheckboxIosProps =
  & WithOptionalClasses<CheckboxIosElementKey, CheckboxIosProps & { active: boolean }>
  & JSX.IntrinsicElements['input'];

const [b, e] = bem('tgui-checkbox-ios');

export function CheckboxIos(props: CheckboxIosProps) {
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
