import { CheckmarkIOS28, type CheckmarkIOS28Props } from '@/icons/common/28/CheckmarkIOS28.jsx';
import { cnCreate } from '@/css/cnCreate.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';

import { e } from '../bem.js';

import './ListIosItemBodyRightCheckmark.scss';

export type ListIosItemBodyRightCheckmarkElementKey = 'root';
export type ListIosItemBodyRightCheckmarkProps =
  & CheckmarkIOS28Props
  & WithOptionalClasses<ListIosItemBodyRightCheckmarkElementKey, ListIosItemBodyRightCheckmarkProps>;

export function ListIosItemBodyRightCheckmark(props: ListIosItemBodyRightCheckmarkProps) {
  const $cn = cnCreate(props, {
    root: v => [v.class, e('item-body-right-checkmark')],
  });
  return <CheckmarkIOS28 {...omitClasses(props)} class={$cn().root}/>;
}