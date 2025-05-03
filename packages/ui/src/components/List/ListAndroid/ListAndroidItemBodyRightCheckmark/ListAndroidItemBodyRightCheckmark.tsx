import { CheckmarkIOS28, type CheckmarkIOS28Props } from '@/icons/common/28/CheckmarkIOS28.jsx';
import { cnCreate } from '@/css/cnCreate.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import type { WithOptionalClasses } from '@/css/types.js';

import { e } from '../bem.js';

import './ListAndroidItemBodyRightCheckmark.scss';

export type ListAndroidItemBodyRightCheckmarkElementKey = 'root';
export type ListAndroidItemBodyRightCheckmarkProps =
  & CheckmarkIOS28Props
  & WithOptionalClasses<ListAndroidItemBodyRightCheckmarkElementKey, ListAndroidItemBodyRightCheckmarkProps>;

export function ListAndroidItemBodyRightCheckmark(props: ListAndroidItemBodyRightCheckmarkProps) {
  const $cn = cnCreate(props, {
    root: v => [v.class, e('item-body-right-checkmark')],
  });
  return <CheckmarkIOS28 {...omitClasses(props)} class={$cn().root}/>;
}