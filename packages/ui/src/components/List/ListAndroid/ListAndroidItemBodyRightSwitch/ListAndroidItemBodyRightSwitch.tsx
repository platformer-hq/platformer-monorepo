import {
  SwitchAndroid,
  type SwitchAndroidElementKey,
  type SwitchAndroidProps,
} from '@/components/Switch/SwitchAndroid/SwitchAndroid.js';
import { styled } from '@/css/styled.js';

import { e } from '../bem.js';

export type ListAndroidItemBodyRightSwitchElementKey = SwitchAndroidElementKey;
export type ListAndroidItemBodyRightSwitchProps = SwitchAndroidProps;

const StyledSwitch = styled(SwitchAndroid, { root: e('item-body-right-switch') });

export function ListAndroidItemBodyRightSwitch(props: SwitchAndroidProps) {
  return <StyledSwitch {...props}/>;
}
