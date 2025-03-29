import { cnCreate } from '@/css/cnCreate.js';
import { TypographyIos } from '@/components/Typography/TypographyIos/TypographyIos.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import { e } from '../bem.js';

import './ListIosItemLeftLabel.scss';

export type ListIosItemLeftLabelElementKey = 'root';
export type ListIosItemLeftLabelProps =
  & JSXIntrinsicElementAttrs<'p'>
  & WithOptionalClasses<ListIosItemLeftLabelElementKey, ListIosItemLeftLabelProps>;

export function ListIosItemLeftLabel(props: ListIosItemLeftLabelProps) {
  const $cn = cnCreate(props, {
    root: v => [v.class, e('item-left-label')],
  });
  return (
    <TypographyIos
      {...omitClasses(props)}
      component="p"
      variant="body"
      class={$cn().root}
    />
  );
}