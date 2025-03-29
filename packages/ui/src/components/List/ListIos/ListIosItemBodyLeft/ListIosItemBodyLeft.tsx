import { Show } from 'solid-js';

import { cnCreate } from '@/css/cnCreate.js';
import { pickProps } from '@/helpers/pickProps.js';
import { omitProps } from '@/helpers/omitProps.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import { e } from '../bem.js';
import { filterSlots } from '../slots.js';
import { ListIosItemBodyLeftLabel } from '../ListIosItemBodyLeftLabel/ListIosItemBodyLeftLabel.js';
import {
  ListIosItemBodyLeftSubtitle,
} from '../ListIosItemBodyLeftSubtitle/ListIosItemBodyLeftSubtitle.js';

import './ListIosItemBodyLeft.scss';

export type ListIosItemBodyLeftElementKey = 'root';
export type ListIosItemBodyLeftProps =
  & JSXIntrinsicElementAttrs<'div'>
  & {
  /**
   * True if the elements direction must be reversed. Applicable only when using ListIosItem with
   * the "large" = true property.
   */
  reversed?: boolean;
}
  & WithOptionalClasses<ListIosItemBodyLeftElementKey, ListIosItemBodyLeftProps & {
  large?: boolean;
}>;

export function ListIosItemBodyLeft(props: ListIosItemBodyLeftProps & {
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
      <ListIosItemBodyLeftLabel {...filterSlots(props, 'bodyLeftLabel')}/>
      <Show when={props.large}>
        <ListIosItemBodyLeftSubtitle {...filterSlots(props, 'bodyLeftSubtitle')}/>
      </Show>
    </div>
  );
}