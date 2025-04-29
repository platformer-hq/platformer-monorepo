import { cnCreate } from '@/css/cnCreate.js';
import { TypographyAndroid } from '@/components/Typography/TypographyAndroid/TypographyAndroid.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import { e } from '../bem.js';

import './ListAndroidItemBodyRightCounter.scss';

export type ListAndroidItemBodyRightCounterElementKey = 'root';
export type ListAndroidItemBodyRightCounterProps =
  & JSXIntrinsicElementAttrs<'p'>
  & WithOptionalClasses<ListAndroidItemBodyRightCounterElementKey, ListAndroidItemBodyRightCounterProps>;

export function ListAndroidItemBodyRightCounter(props: ListAndroidItemBodyRightCounterProps) {
  const $cn = cnCreate(props, {
    root: v => [v.class, e('item-body-right-counter')],
  });
  return (
    <TypographyAndroid
      {...omitClasses(props)}
      variant="subtitle2"
      weight="medium"
      component="p"
      class={$cn().root}
    />
  );
}