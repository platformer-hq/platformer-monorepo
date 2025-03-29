import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';
import type { WithOptionalClasses } from '@/css/types.js';

import { cnCreate } from '@/css/cnCreate.js';
import { pickProps } from '@/helpers/pickProps.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import { omitProps } from '@/helpers/omitProps.js';

import { e } from '../bem.js';

import './ListIosItemLeftIcon.scss';

export type ListIosItemLeftIconElementKey = 'root' | 'image';
export type ListIosItemLeftIconProps =
  & JSXIntrinsicElementAttrs<'div'>
  & WithOptionalClasses<ListIosItemLeftIconElementKey, ListIosItemLeftIconProps>
  & {
  /**
   * True if the icon must be rounded.
   */
  rounded?: boolean;
};

export function ListIosItemLeftIcon(props: ListIosItemLeftIconProps) {
  const $cn = cnCreate(props, {
    root: v => [v.class, e('item-left-icon')],
    image: v => e('item-left-icon-image', pickProps(v, ['rounded'])),
  });
  return (
    <div {...omitProps(omitClasses(props), ['rounded'])} class={$cn().root}>
      <i class={$cn().image}>
        {props.children}
      </i>
    </div>
  );
}