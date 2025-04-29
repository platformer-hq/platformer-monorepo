import { cnCreate } from '@/css/cnCreate.js';

import { XmarkFill28, type XmarkFill28Props } from '@/icons/common/28/XmarkFill28.jsx';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';

import { e } from '../bem.js';

import './ListAndroidItemBodyRightClear.scss';

export type ListAndroidItemBodyRightClearElementKey = 'root';
export type ListAndroidItemBodyRightClearProps =
  & XmarkFill28Props
  & WithOptionalClasses<ListAndroidItemBodyRightClearElementKey, ListAndroidItemBodyRightClearProps>;

export function ListAndroidItemBodyRightClear(props: ListAndroidItemBodyRightClearProps) {
  const $cn = cnCreate(props, { root: e('item-body-right-clear') });
  return <XmarkFill28 {...omitClasses(props)} size={20} class={$cn().root}/>;
}