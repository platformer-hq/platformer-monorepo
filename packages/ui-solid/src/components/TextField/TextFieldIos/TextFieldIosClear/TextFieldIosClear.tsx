import type { JSX } from 'solid-js';

import { cnCreate } from '@/css/cnCreate.js';
import { XmarkFill28 } from '@/icons/index.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';

import { e } from '../bem.js';

import './TextFieldIosClear.scss';

export type TextFieldIosClearElementKey = 'root' | 'icon';
export type TextFieldIosClearProps =
  & WithOptionalClasses<TextFieldIosClearElementKey, TextFieldIosClearProps>
  & JSX.IntrinsicElements['i'];

export function TextFieldIosClear(props: TextFieldIosClearProps) {
  const $cn = cnCreate(props, {
    root: e('clear'),
    icon: e('clear-icon'),
  });
  return (
    <i {...omitClasses(props)} class={$cn().root}>
      <XmarkFill28 class={$cn().icon}/>
    </i>
  );
}