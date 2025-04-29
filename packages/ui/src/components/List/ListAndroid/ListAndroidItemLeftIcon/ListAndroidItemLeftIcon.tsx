import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';
import type { WithOptionalClasses } from '@/css/types.js';

import { cnCreate } from '@/css/cnCreate.js';
import { pickProps } from '@/helpers/pickProps.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import { omitProps } from '@/helpers/omitProps.js';

import { eGen } from '../bem.js';

import './ListAndroidItemLeftIcon.scss';

export type ListAndroidItemLeftIconElementKey = 'root' | 'image';
export type ListAndroidItemLeftIconProps =
  & JSXIntrinsicElementAttrs<'div'>
  & WithOptionalClasses<ListAndroidItemLeftIconElementKey, ListAndroidItemLeftIconProps>
  & {
  /**
   * True if the icon must be rounded.
   */
  rounded?: boolean;
};

const e = eGen('item-left-icon');

export function ListAndroidItemLeftIcon(props: ListAndroidItemLeftIconProps) {
  const $cn = cnCreate(props, {
    root: v => [v.class, e()],
    image: v => e('image', pickProps(v, ['rounded'])),
  });
  return (
    <div {...omitProps(omitClasses(props), ['rounded'])} class={$cn().root}>
      <i class={$cn().image}>
        {props.children}
      </i>
    </div>
  );
}