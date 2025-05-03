import { cnCreate } from '@/css/cnCreate.js';
import { TypographyAndroid } from '@/components/Typography/TypographyAndroid/TypographyAndroid.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import { e } from '../bem.js';

import './ListAndroidItemBodyLeftSubtitle.scss';

export type ListAndroidItemBodyLeftSubtitleElementKey = 'root';
export type ListAndroidItemBodyLeftSubtitleProps =
  & JSXIntrinsicElementAttrs<'p'>
  & WithOptionalClasses<ListAndroidItemBodyLeftSubtitleElementKey, ListAndroidItemBodyLeftSubtitleProps>;

export function ListAndroidItemBodyLeftSubtitle(props: ListAndroidItemBodyLeftSubtitleProps) {
  const $cn = cnCreate(props, { root: e('item-body-left-subtitle') });
  return (
    <TypographyAndroid
      {...omitClasses(props)}
      class={$cn().root}
      variant="subtitle1"
    />
  );
}