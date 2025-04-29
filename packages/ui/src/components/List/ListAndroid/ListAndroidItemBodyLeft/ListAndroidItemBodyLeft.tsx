import { Show } from 'solid-js';

import { cnCreate } from '@/css/cnCreate.js';
import { pickProps } from '@/helpers/pickProps.js';
import { omitProps } from '@/helpers/omitProps.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import { e } from '../bem.js';
import { filterSlots } from '../slots.js';
import { ListAndroidItemBodyLeftLabel } from '../ListAndroidItemBodyLeftLabel/ListAndroidItemBodyLeftLabel.js';
import {
  ListAndroidItemBodyLeftSubtitle,
} from '../ListAndroidItemBodyLeftSubtitle/ListAndroidItemBodyLeftSubtitle.js';

import './ListAndroidItemBodyLeft.scss';

export type ListAndroidItemBodyLeftElementKey = 'root';
export type ListAndroidItemBodyLeftProps =
  & JSXIntrinsicElementAttrs<'div'>
  & {
  /**
   * True if the elements direction must be reversed. Applicable only when using ListAndroidItem with
   * the "large" = true property.
   */
  reversed?: boolean;
}
  & WithOptionalClasses<ListAndroidItemBodyLeftElementKey, ListAndroidItemBodyLeftProps & {
  large?: boolean;
}>;

export function ListAndroidItemBodyLeft(props: ListAndroidItemBodyLeftProps & {
  large?: boolean;
  reversed?: boolean;
}) {
  const $cn = cnCreate(props, {
    root: v => [
      v.class,
      e('item-body-left', pickProps(v, ['reversed', 'large'])),
    ],
  });
  return (
    <div {...omitProps(omitClasses(props), ['large', 'reversed'])} class={$cn().root}>
      <ListAndroidItemBodyLeftLabel {...filterSlots(props, 'bodyLeftLabel')}/>
      <Show when={props.large}>
        <ListAndroidItemBodyLeftSubtitle {...filterSlots(props, 'bodyLeftSubtitle')}/>
      </Show>
    </div>
  );
}