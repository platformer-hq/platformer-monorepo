import { Dynamic } from 'solid-js/web';

import { Tappable, TappableProps } from '@/components/Tappable/Tappable.js';
import { cnCreate } from '@/css/cnCreate.js';
import { pickProps } from '@/helpers/pickProps.js';
import { pickChildren } from '@/helpers/pickChildren.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import { omitProps } from '@/helpers/omitProps.js';
import { accessor } from '@/helpers/accessor.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import { e } from '../bem.js';
import { filterSlots } from '../slots.js';
import { ListAndroidItemBody } from '../ListAndroidItemBody/ListAndroidItemBody.js';
import { ListAndroidItemLeft } from '../ListAndroidItemLeft/ListAndroidItemLeft.js';

export type ListAndroidItemElementKey = 'root' | 'body' | 'inner';
export type ListAndroidItemVariant = 'regular' | 'accent' | 'destructive' | 'placeholder';
export type ListAndroidItemProps =
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
  /**
   * Visual variant.
   */
  variant?: ListAndroidItemVariant;
}
  & WithOptionalClasses<ListAndroidItemElementKey, ListAndroidItemProps & {
  /**
   * True if this item is the first one in the list.
   */
  first: boolean;
}>;

import './ListAndroidItem.scss';

function Clickable(props: Omit<TappableProps<'button'>, 'component'>) {
  return <Tappable component="button" {...props}/>;
}

export function ListAndroidItem(props: ListAndroidItemProps & { first: boolean }) {
  const $cn = cnCreate(props, {
    root: v => [v.class, e('item', pickProps(v, ['large']), props.variant || 'regular')],
    inner: e('item-inner'),
  });
  const $clickable = accessor(props, 'clickable');

  return (
    <li
      {...omitProps(omitClasses(props), ['large', 'first', 'clickable'])}
      class={$cn().root}
    >
      <Dynamic component={$clickable() ? Clickable : 'div'} class={$cn().inner}>
        <ListAndroidItemLeft {...pickChildren(props)} {...filterSlots(props, 'left')}/>
        <ListAndroidItemBody
          {...pickChildren(props, ['first', 'large'])}
          {...filterSlots(props, 'body')}
        />
      </Dynamic>
    </li>
  );
}