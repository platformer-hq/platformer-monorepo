import { Show } from 'solid-js';

import { cnCreate } from '@/css/cnCreate.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import { e } from '../bem.js';
import { filterSlots } from '../slots.js';
import {
  ListAndroidItemBodyRightChevron,
} from '../ListAndroidItemBodyRightChevron/ListAndroidItemBodyRightChevron.js';
import {
  ListAndroidItemBodyRightCheckmark,
} from '../ListAndroidItemBodyRightCheckmark/ListAndroidItemBodyRightCheckmark.js';
import {
  ListAndroidItemBodyRightLabel,
} from '../ListAndroidItemBodyRightLabel/ListAndroidItemBodyRightLabel.js';
import {
  ListAndroidItemBodyRightCounter,
} from '../ListAndroidItemBodyRightCounter/ListAndroidItemBodyRightCounter.js';
import {
  ListAndroidItemBodyRightSwitch,
} from '../ListAndroidItemBodyRightSwitch/ListAndroidItemBodyRightSwitch.js';
import {
  ListAndroidItemBodyRightClear,
} from '../ListAndroidItemBodyRightClear/ListAndroidItemBodyRightClear.js';
import {
  ListAndroidItemBodyRightRadio,
} from '../ListAndroidItemBodyRightRadio/ListAndroidItemBodyRightRadio.js';

import './ListAndroidItemBodyRight.scss';

export type ListAndroidItemBodyRightElementKey = 'root';
export type ListAndroidItemBodyRightProps =
  & JSXIntrinsicElementAttrs<'div'>
  & WithOptionalClasses<ListAndroidItemBodyRightElementKey, ListAndroidItemBodyRightProps>;

export function ListAndroidItemBodyRight(props: ListAndroidItemBodyRightProps) {
  const $cn = cnCreate(props, { root: e('item-body-right') });
  return (
    <div {...omitClasses(props)} class={$cn().root}>
      <Show when={filterSlots(props, 'bodyRightLabel')}>
        {$box => <ListAndroidItemBodyRightLabel {...$box()}/>}
      </Show>
      <Show when={filterSlots(props, 'bodyRightCounter')}>
        {$box => <ListAndroidItemBodyRightCounter {...$box()}/>}
      </Show>
      <Show when={filterSlots(props, 'bodyRightChevron')}>
        {$box => <ListAndroidItemBodyRightChevron {...$box()}/>}
      </Show>
      <Show when={filterSlots(props, 'bodyRightSwitch')}>
        {$box => <ListAndroidItemBodyRightSwitch {...$box()}/>}
      </Show>
      <Show when={filterSlots(props, 'bodyRightRadio')}>
        {$box => <ListAndroidItemBodyRightRadio {...$box()}/>}
      </Show>
      <Show when={filterSlots(props, 'bodyRightCheckmark')}>
        {$box => <ListAndroidItemBodyRightCheckmark {...$box()}/>}
      </Show>
      <Show when={filterSlots(props, 'bodyRightClear')}>
        {$box => <ListAndroidItemBodyRightClear {...$box()}/>}
      </Show>
    </div>
  );
}