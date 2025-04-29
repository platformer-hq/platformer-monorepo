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
import { ListAndroidItemBodyLeft } from '../ListAndroidItemBodyLeft/ListAndroidItemBodyLeft.js';
import { ListAndroidItemBodyRight } from '../ListAndroidItemBodyRight/ListAndroidItemBodyRight.js';
import { ListAndroidItemBodyInput } from '../ListAndroidItemBodyInput/ListAndroidItemBodyInput.js';

import './ListAndroidItemBody.scss';

export type ListAndroidItemBodyElementKey = 'root';
export type ListAndroidItemBodyProps =
  & JSXIntrinsicElementAttrs<'span'>
  & WithOptionalClasses<ListAndroidItemBodyElementKey, ListAndroidItemBodyProps & {
  large?: boolean;
  first: boolean;
}>;

export function ListAndroidItemBody(props: ListAndroidItemBodyProps & {
  large?: boolean;
  first: boolean;
}) {
  const $cn = cnCreate(props, {
    root: v => [v.class, e('item-body', pickProps(v, ['first']))],
  });

  return (
    <span {...omitProps(omitClasses(props), ['large', 'first'])} class={$cn().root}>
      <Show
        when={filterSlots(props, 'bodyInput')}
        fallback={
          <>
            <ListAndroidItemBodyLeft
              {...pickChildren(props, ['large'])}
              {...filterSlots(props, 'bodyLeft')}
            />
            <ListAndroidItemBodyRight
              {...pickChildren(props)}
              {...filterSlots(props, 'bodyRight')}
            />
          </>
        }
      >
        {$box => <ListAndroidItemBodyInput {...$box()}/>}
      </Show>
    </span>
  );
}