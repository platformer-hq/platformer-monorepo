import { cnCreate } from '@/css/cnCreate.js';
import { TypographyAndroid } from '@/components/Typography/TypographyAndroid/TypographyAndroid.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import { e } from '../bem.js';

import './ListAndroidItemLeftLabel.scss';

export type ListAndroidItemLeftLabelElementKey = 'root';
export type ListAndroidItemLeftLabelProps =
  & JSXIntrinsicElementAttrs<'p'>
  & WithOptionalClasses<ListAndroidItemLeftLabelElementKey, ListAndroidItemLeftLabelProps>;

export function ListAndroidItemLeftLabel(props: ListAndroidItemLeftLabelProps) {
  const $cn = cnCreate(props, {
    root: v => [v.class, e('item-left-label')],
  });
  return (
    <TypographyAndroid
      {...omitClasses(props)}
      component="p"
      variant="body1"
      class={$cn().root}
    />
  );
}