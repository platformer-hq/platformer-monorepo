import type { JSX, ParentProps } from 'solid-js';

import type { WithOptionalClasses } from '@/css/types.js';
import { TypographyIos } from '@/components/Typography/TypographyIos/TypographyIos.js';
import { cnCreate } from '@/css/cnCreate.js';

import { e } from '../bem.js';

import './TextFieldIosPlaceholder.scss';

export type TextFieldIosPlaceholderElementKey = 'root';
export type TextFieldIosPlaceholderProps =
  & WithOptionalClasses<TextFieldIosPlaceholderElementKey, TextFieldIosPlaceholderProps>
  & JSX.IntrinsicElements['p']
  & ParentProps;

export function TextFieldIosPlaceholder(props: TextFieldIosPlaceholderProps) {
  const $cn = cnCreate(props, {
    root: v => [e('placeholder'), v.class],
  });
  return <TypographyIos {...props} class={$cn().root} variant="body"/>;
}