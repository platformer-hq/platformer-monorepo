import { createMemo, Match, Show, Switch } from 'solid-js';

import { cnCreate } from '@/css/cnCreate.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import { ListIosItemLeftIcon } from '../ListIosItemLeftIcon/ListIosItemLeftIcon.js';
import { ListIosItemLeftLabel } from '../ListIosItemLeftLabel/ListIosItemLeftLabel.js';
import { ListIosItemLeftCheckbox } from '../ListIosItemLeftCheckbox/ListIosItemLeftCheckbox.js';

import { e } from '../bem.js';
import { filterSlots } from '../slots.js';

import './ListIosItemLeft.scss';

export type ListIosItemLeftElementKey = 'root';
export type ListIosItemLeftProps =
  & JSXIntrinsicElementAttrs<'div'>
  & WithOptionalClasses<ListIosItemLeftElementKey, ListIosItemLeftProps>;

export function ListIosItemLeft(props: ListIosItemLeftProps) {
  const $cn = cnCreate(props, { root: e('item-left') });
  const $icon = createMemo(() => filterSlots(props, 'leftIcon'));
  const $label = createMemo(() => filterSlots(props, 'leftLabel'));
  const $leftCheckbox = createMemo(() => filterSlots(props, 'leftCheckbox'));
  return (
    <Show when={$icon() || $label() || $leftCheckbox()}>
      <div {...omitClasses(props)} class={$cn().root}>
        <Switch>
          <Match when={$icon()}>
            <ListIosItemLeftIcon {...$icon()}/>
          </Match>
          <Match when={$label()}>
            <ListIosItemLeftLabel {...$label()}/>
          </Match>
          <Match when={$leftCheckbox()}>
            <ListIosItemLeftCheckbox {...$leftCheckbox()}/>
          </Match>
        </Switch>
      </div>
    </Show>
  );
}