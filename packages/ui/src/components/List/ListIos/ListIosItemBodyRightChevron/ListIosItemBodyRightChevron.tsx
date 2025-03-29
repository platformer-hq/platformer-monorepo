import { cnCreate } from '@/css/cnCreate.js';

import { ChevronRight28, type ChevronRight28Props } from '@/icons/common/28/ChevronRight28.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';

import { e } from '../bem.js';

import './ListIosItemBodyRightChevron.scss';

export type ListIosItemBodyRightChevronElementKey = 'root';
export type ListIosItemBodyRightChevronProps =
  & ChevronRight28Props
  & WithOptionalClasses<ListIosItemBodyRightChevronElementKey, ListIosItemBodyRightChevronProps>;

export function ListIosItemBodyRightChevron(props: ListIosItemBodyRightChevronProps) {
  const $cn = cnCreate(props, { root: e('item-body-right-chevron') });
  return <ChevronRight28 {...omitClasses(props)} class={$cn().root}/>;
}