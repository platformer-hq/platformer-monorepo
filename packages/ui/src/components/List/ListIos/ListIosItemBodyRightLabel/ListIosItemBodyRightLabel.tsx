import { cnCreate } from '@/css/cnCreate.js';
import { TypographyIos } from '@/components/Typography/TypographyIos/TypographyIos.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import { e } from '../bem.js';

import './ListIosItemBodyRightLabel.scss';

export type ListIosItemBodyRightLabelElementKey = 'root';
export type ListIosItemBodyRightLabelProps =
  & JSXIntrinsicElementAttrs<'p'>
  & WithOptionalClasses<ListIosItemBodyRightLabelElementKey, ListIosItemBodyRightLabelProps>;

export function ListIosItemBodyRightLabel(props: ListIosItemBodyRightLabelProps) {
  const $cn = cnCreate(props, { root: e('item-body-right-label') });
  return (
    <TypographyIos
      {...omitClasses(props)}
      component="p"
      variant="body"
      class={$cn().root}
    />
  );
}