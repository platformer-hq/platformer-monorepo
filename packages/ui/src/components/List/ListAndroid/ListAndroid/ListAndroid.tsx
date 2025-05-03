import { Show, For, type JSXElement } from 'solid-js';

import { TypographyAndroid } from '@/components/Typography/TypographyAndroid/TypographyAndroid.js';
import { cnCreate } from '@/css/cnCreate.js';
import type { WithOptionalClasses } from '@/css/types.js';

import { b, e } from '../bem.js';
import { filterSlots } from '../slots.js';
import { ListAndroidItem } from '../ListAndroidItem/ListAndroidItem.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import { omitProps } from '@/helpers/omitProps.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import './ListAndroid.scss';

export type ListAndroidElementKey = 'root' | 'body' | 'title' | 'footer' | 'list';
export type ListAndroidProps =
  & WithOptionalClasses<ListAndroidElementKey, ListAndroidProps>
  & JSXIntrinsicElementAttrs<'div'>
  & {
  /**
   * Text displayed in the upper part of the list.
   */
  title?: string;
  /**
   * Text displayed in the lower part of the list.
   */
  footer?: JSXElement;
}

export function ListAndroid(props: ListAndroidProps) {
  const $cn = cnCreate(props, {
    root: v => [b(), v.class],
    body: e('body'),
    title: e('title'),
    list: e('list'),
    footer: e('footer'),
  });
  return (
    <div {...omitProps(omitClasses(props), ['title', 'footer'])} class={$cn().root}>
      <div class={$cn().body}>
        <Show when={props.title}>
          <TypographyAndroid class={$cn().title} variant="button1">
            {props.title}
          </TypographyAndroid>
        </Show>
        <ul class={$cn().list}>
          <For each={filterSlots(props, 'root', true)}>
            {(box, $index) => (
              <ListAndroidItem {...box} first={$index() === 0}/>
            )}
          </For>
        </ul>
      </div>
      <Show when={props.footer}>
        <TypographyAndroid class={$cn().footer} variant="subtitle2">
          {props.footer}
        </TypographyAndroid>
      </Show>
    </div>
  );
}
