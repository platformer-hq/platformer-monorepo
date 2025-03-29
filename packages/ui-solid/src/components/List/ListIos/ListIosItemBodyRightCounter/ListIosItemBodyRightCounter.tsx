import { cnCreate } from '@/css/cnCreate.js';
import { TypographyIos } from '@/components/Typography/TypographyIos/TypographyIos.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import { e } from '../bem.js';

import './ListIosItemBodyRightCounter.scss';

export type ListIosItemBodyRightCounterElementKey = 'root';
export type ListIosItemBodyRightCounterProps =
  & JSXIntrinsicElementAttrs<'p'>
  & WithOptionalClasses<ListIosItemBodyRightCounterElementKey, ListIosItemBodyRightCounterProps>;

export function ListIosItemBodyRightCounter(props: ListIosItemBodyRightCounterProps) {
  const $cn = cnCreate(props, {
    root: v => [v.class, e('item-body-right-counter')],
  });
  return (
    <TypographyIos
      {...omitClasses(props)}
      variant="callout"
      component="p"
      class={$cn().root}
    />
  );
}