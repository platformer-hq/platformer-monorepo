import { Show } from 'solid-js';

import { cnCreate } from '@/css/cnCreate.js';
import { pickProps } from '@/helpers/pickProps.js';
import { pickChildren } from '@/helpers/pickChildren.js';
import { omitProps } from '@/helpers/omitProps.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import { e } from '../bem.js';
import { filterSlots } from '../slots.js';
import { ListIosItemBodyLeft } from '../ListIosItemBodyLeft/ListIosItemBodyLeft.js';
import { ListIosItemBodyRight } from '../ListIosItemBodyRight/ListIosItemBodyRight.js';
import { ListIosItemBodyInput } from '../ListIosItemBodyInput/ListIosItemBodyInput.js';

import './ListIosItemBody.scss';

export type ListIosItemBodyElementKey = 'root';
export type ListIosItemBodyProps =
  & JSXIntrinsicElementAttrs<'span'>
  & WithOptionalClasses<ListIosItemBodyElementKey, ListIosItemBodyProps & {
  large?: boolean;
  first: boolean;
}>;

export function ListIosItemBody(props: ListIosItemBodyProps & {
  large?: boolean;
  first: boolean;
}) {
  const $cn = cnCreate(props, {
    root: v => [
      v.class,
      e('item-body', pickProps(v, ['first'])),
    ],
  });

  return (
    <span {...omitProps(omitClasses(props), ['large', 'first'])} class={$cn().root}>
      <Show
        when={filterSlots(props, 'bodyInput')}
        fallback={
          <>
            <ListIosItemBodyLeft
              {...pickChildren(props, ['large'])}
              {...filterSlots(props, 'bodyLeft')}
            />
            <ListIosItemBodyRight
              {...pickChildren(props)}
              {...filterSlots(props, 'bodyRight')}
            />
          </>
        }
      >
        {$box => <ListIosItemBodyInput {...$box()}/>}
      </Show>
    </span>
  );
}