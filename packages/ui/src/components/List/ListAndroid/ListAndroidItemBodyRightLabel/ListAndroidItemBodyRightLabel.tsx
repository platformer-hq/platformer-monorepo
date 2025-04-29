import { cnCreate } from '@/css/cnCreate.js';
import { TypographyAndroid } from '@/components/Typography/TypographyAndroid/TypographyAndroid.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import { e } from '../bem.js';

import './ListAndroidItemBodyRightLabel.scss';

export type ListAndroidItemBodyRightLabelElementKey = 'root';
export type ListAndroidItemBodyRightLabelProps =
  & JSXIntrinsicElementAttrs<'p'>
  & WithOptionalClasses<ListAndroidItemBodyRightLabelElementKey, ListAndroidItemBodyRightLabelProps>;

export function ListAndroidItemBodyRightLabel(props: ListAndroidItemBodyRightLabelProps) {
  const $cn = cnCreate(props, { root: e('item-body-right-label') });
  return (
    <TypographyAndroid
      {...omitClasses(props)}
      component="p"
      variant="body1"
      class={$cn().root}
    />
  );
}