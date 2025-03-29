import type { JSX } from 'solid-js';

import type { WithOptionalClasses } from '@/css/types.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import { cnCreate } from '@/css/cnCreate.js';

import { e } from '../bem.js';

import './TextFieldIosInput.scss';

export type TextFieldIosInputElementKey = 'root';
export type TextFieldIosInputProps =
  & WithOptionalClasses<TextFieldIosInputElementKey, TextFieldIosInputProps & {
    clearShown: boolean;
  }>
  & Omit<JSX.IntrinsicElements['input'], 'value' | 'placeholder'>
  & { value?: string };

export function TextFieldIosInput(props: TextFieldIosInputProps & {
  clearShown: boolean;
  value: string;
}) {
  const $cn = cnCreate(props, {
    root: v => [v.class, e('input', v.clearShown && 'clear-shown')],
  });

  return <input {...omitClasses(props)} class={$cn().root}/>;
}