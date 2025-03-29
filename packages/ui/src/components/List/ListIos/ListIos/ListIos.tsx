import { Show, For, type JSXElement } from 'solid-js';

import { TypographyIos } from '@/components/Typography/TypographyIos/TypographyIos.js';
import { cnCreate } from '@/css/cnCreate.js';
import type { WithOptionalClasses } from '@/css/types.js';

import { b, e } from '../bem.js';
import { filterSlots } from '../slots.js';
import { ListIosItem } from '../ListIosItem/ListIosItem.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import { omitProps } from '@/helpers/omitProps.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import './ListIos.scss';

export type ListIosElementKey = 'root' | 'title' | 'footer' | 'list';
export type ListIosProps =
  & WithOptionalClasses<ListIosElementKey, ListIosProps>
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

export function ListIos(props: ListIosProps) {
  const $cn = cnCreate(props, {
    root: v => [b(), v.class],
    title: e('title'),
    list: e('list'),
    footer: e('footer'),
  });
  return (
    <div {...omitProps(omitClasses(props), ['title', 'footer'])} class={$cn().root}>
      <Show when={props.title}>
        <TypographyIos class={$cn().title} variant="footnote" caps>
          {props.title}
        </TypographyIos>
      </Show>
      <ul class={$cn().list}>
        <For each={filterSlots(props, 'root', true)}>
          {(box, $index) => (
            <ListIosItem {...box} first={$index() === 0}/>
          )}
        </For>
      </ul>
      <Show when={props.footer}>
        <TypographyIos class={$cn().footer} variant="footnote">
          {props.footer}
        </TypographyIos>
      </Show>
    </div>
  );
}
