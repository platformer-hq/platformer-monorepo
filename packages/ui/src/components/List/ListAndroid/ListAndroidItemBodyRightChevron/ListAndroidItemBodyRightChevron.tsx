import { cnCreate } from '@/css/cnCreate.js';

import { ChevronRight28, type ChevronRight28Props } from '@/icons/common/28/ChevronRight28.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';

import { e } from '../bem.js';

import './ListAndroidItemBodyRightChevron.scss';

export type ListAndroidItemBodyRightChevronElementKey = 'root';
export type ListAndroidItemBodyRightChevronProps =
  & ChevronRight28Props
  & WithOptionalClasses<ListAndroidItemBodyRightChevronElementKey, ListAndroidItemBodyRightChevronProps>;

export function ListAndroidItemBodyRightChevron(props: ListAndroidItemBodyRightChevronProps) {
  const $cn = cnCreate(props, { root: e('item-body-right-chevron') });
  return <ChevronRight28 {...omitClasses(props)} class={$cn().root}/>;
}