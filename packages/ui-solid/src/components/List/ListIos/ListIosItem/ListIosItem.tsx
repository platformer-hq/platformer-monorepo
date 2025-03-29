import { Dynamic } from 'solid-js/web';
import { mergeProps } from 'solid-js';
import { signalsToRecord } from '@/helpers/signalsToRecord.js';

import { cnCreate } from '@/css/cnCreate.js';
import { pickProps } from '@/helpers/pickProps.js';
import { pickChildren } from '@/helpers/pickChildren.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import { omitProps } from '@/helpers/omitProps.js';
import { accessor } from '@/helpers/accessor.js';
import { useActiveStateHandler } from '@/hooks/useActiveStateHandler.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import { e } from '../bem.js';
import { filterSlots } from '../slots.js';
import { ListIosItemBody } from '../ListIosItemBody/ListIosItemBody.js';
import { ListIosItemLeft } from '../ListIosItemLeft/ListIosItemLeft.js';

export type ListIosItemElementKey = 'root' | 'body' | 'inner';
export type ListIosItemProps =
  & JSXIntrinsicElementAttrs<'li'>
  & {
  /**
   * True if the element is clickable. This will add some additional visual changes to the element.
   */
  clickable?: boolean;
  /**
   * True if the item has a large size.
   */
  large?: boolean;
}
  & WithOptionalClasses<ListIosItemElementKey, ListIosItemProps & {
  /**
   * True if the element is currently active.
   */
  active: boolean;
  /**
   * True if this item is the first one in the list.
   */
  first: boolean;
}>;

import './ListIosItem.scss';

export function ListIosItem(props: ListIosItemProps & { first: boolean }) {
  const [$active, onPointerDown] = useActiveStateHandler();
  const $cn = cnCreate(
    mergeProps(props, signalsToRecord({ active: $active })),
    {
      root: v => [v.class, e('item', pickProps(v, ['large']))],
      inner: v => e('item-inner', pickProps(v, ['clickable', 'active'])),
    },
  );
  const $clickable = accessor(props, 'clickable');

  return (
    <li
      {...omitProps(omitClasses(props), ['large', 'first', 'clickable'])}
      class={$cn().root}
    >
      <Dynamic
        component={$clickable() ? 'button' : 'div'}
        class={$cn().inner}
        onPointerDown={$clickable() ? onPointerDown : undefined}
      >
        <ListIosItemLeft {...pickChildren(props)} {...filterSlots(props, 'left')}/>
        <ListIosItemBody
          {...pickChildren(props, ['first', 'large'])}
          {...filterSlots(props, 'body')}
        />
      </Dynamic>
    </li>
  );
}