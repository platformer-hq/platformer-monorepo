import { createMemo, Match, Show, Switch } from 'solid-js';

import { cnCreate } from '@/css/cnCreate.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import { ListAndroidItemLeftIcon } from '../ListAndroidItemLeftIcon/ListAndroidItemLeftIcon.js';
import { ListAndroidItemLeftLabel } from '../ListAndroidItemLeftLabel/ListAndroidItemLeftLabel.js';
import { ListAndroidItemLeftCheckbox } from '../ListAndroidItemLeftCheckbox/ListAndroidItemLeftCheckbox.js';

import { e } from '../bem.js';
import { filterSlots } from '../slots.js';

import './ListAndroidItemLeft.scss';

export type ListAndroidItemLeftElementKey = 'root';
export type ListAndroidItemLeftProps =
  & JSXIntrinsicElementAttrs<'div'>
  & WithOptionalClasses<ListAndroidItemLeftElementKey, ListAndroidItemLeftProps>;

export function ListAndroidItemLeft(props: ListAndroidItemLeftProps) {
  const $cn = cnCreate(props, { root: e('item-left') });
  const $icon = createMemo(() => filterSlots(props, 'leftIcon'));
  const $label = createMemo(() => filterSlots(props, 'leftLabel'));
  const $leftCheckbox = createMemo(() => filterSlots(props, 'leftCheckbox'));
  return (
    <Show when={$icon() || $label() || $leftCheckbox()}>
      <div {...omitClasses(props)} class={$cn().root}>
        <Switch>
          <Match when={$icon()}>
            <ListAndroidItemLeftIcon {...$icon()}/>
          </Match>
          <Match when={$label()}>
            <ListAndroidItemLeftLabel {...$label()}/>
          </Match>
          <Match when={$leftCheckbox()}>
            <ListAndroidItemLeftCheckbox {...$leftCheckbox()}/>
          </Match>
        </Switch>
      </div>
    </Show>
  );
}