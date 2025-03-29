import { cnCreate } from '@/css/cnCreate.js';
import { TypographyIos } from '@/components/Typography/TypographyIos/TypographyIos.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import { e } from '../bem.js';

import './ListIosItemBodyLeftSubtitle.scss';

export type ListIosItemBodyLeftSubtitleElementKey = 'root';
export type ListIosItemBodyLeftSubtitleProps =
  & JSXIntrinsicElementAttrs<'p'>
  & WithOptionalClasses<ListIosItemBodyLeftSubtitleElementKey, ListIosItemBodyLeftSubtitleProps>;

export function ListIosItemBodyLeftSubtitle(props: ListIosItemBodyLeftSubtitleProps) {
  const $cn = cnCreate(props, { root: e('item-body-left-subtitle') });
  return (
    <TypographyIos
      {...omitClasses(props)}
      class={$cn().root}
      variant="subheadline2"
    />
  );
}