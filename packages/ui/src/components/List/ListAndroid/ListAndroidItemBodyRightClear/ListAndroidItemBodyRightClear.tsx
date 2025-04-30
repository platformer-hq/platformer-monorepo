import { cnCreate } from '@/css/cnCreate.js';

import { Xmark24, type Xmark24Props } from '@/icons/common/24/Xmark24.jsx';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';

import { e } from '../bem.js';

import './ListAndroidItemBodyRightClear.scss';

export type ListAndroidItemBodyRightClearElementKey = 'root';
export type ListAndroidItemBodyRightClearProps =
  & Xmark24Props
  & WithOptionalClasses<ListAndroidItemBodyRightClearElementKey, ListAndroidItemBodyRightClearProps>;

export function ListAndroidItemBodyRightClear(props: ListAndroidItemBodyRightClearProps) {
  const $cn = cnCreate(props, { root: e('item-body-right-clear') });
  return <Xmark24 {...omitClasses(props)} size={20} class={$cn().root}/>;
}