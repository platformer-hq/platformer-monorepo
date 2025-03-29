import { Show } from 'solid-js';

import { cnCreate } from '@/css/cnCreate.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import { e } from '../bem.js';
import { filterSlots } from '../slots.js';
import {
  ListIosItemBodyRightChevron,
} from '../ListIosItemBodyRightChevron/ListIosItemBodyRightChevron.js';
import {
  ListIosItemBodyRightCheckmark,
} from '../ListIosItemBodyRightCheckmark/ListIosItemBodyRightCheckmark.js';
import {
  ListIosItemBodyRightLabel,
} from '../ListIosItemBodyRightLabel/ListIosItemBodyRightLabel.js';
import { ListIosItemBodyRightCounter } from '../ListIosItemBodyRightCounter/ListIosItemBodyRightCounter.js';
import {
  ListIosItemBodyRightSwitch,
} from '../ListIosItemBodyRightSwitch/ListIosItemBodyRightSwitch.js';
import {
  ListIosItemBodyRightClear,
} from '../ListIosItemBodyRightClear/ListIosItemBodyRightClear.js';

import './ListIosItemBodyRight.scss';

export type ListIosItemBodyRightElementKey = 'root';
export type ListIosItemBodyRightProps =
  & JSXIntrinsicElementAttrs<'div'>
  & WithOptionalClasses<ListIosItemBodyRightElementKey, ListIosItemBodyRightProps>;

export function ListIosItemBodyRight(props: ListIosItemBodyRightProps) {
  const $cn = cnCreate(props, { root: e('item-body-right') });
  return (
    <div {...omitClasses(props)} class={$cn().root}>
      <Show when={filterSlots(props, 'bodyRightLabel')}>
        {$box => <ListIosItemBodyRightLabel {...$box()}/>}
      </Show>
      <Show when={filterSlots(props, 'bodyRightCounter')}>
        {$box => <ListIosItemBodyRightCounter {...$box()}/>}
      </Show>
      <Show when={filterSlots(props, 'bodyRightChevron')}>
        {$box => <ListIosItemBodyRightChevron {...$box()}/>}
      </Show>
      <Show when={filterSlots(props, 'bodyRightSwitch')}>
        {$box => <ListIosItemBodyRightSwitch {...$box()}/>}
      </Show>
      <Show when={filterSlots(props, 'bodyRightCheckmark')}>
        {$box => <ListIosItemBodyRightCheckmark {...$box()}/>}
      </Show>
      <Show when={filterSlots(props, 'bodyRightClear')}>
        {$box => <ListIosItemBodyRightClear {...$box()}/>}
      </Show>
    </div>
  );
}