import {
  SwitchIos,
  type SwitchIosElementKey,
  type SwitchIosProps,
} from '@/components/Switch/SwitchIos/SwitchIos.js';
import { styled } from '@/css/styled.js';

import { e } from '../bem.js';

export type ListIosItemBodyRightSwitchElementKey = SwitchIosElementKey;
export type ListIosItemBodyRightSwitchProps = SwitchIosProps;

import './ListIosItemBodyRightSwitch.scss';

const StyledSwitch = styled(SwitchIos, { root: e('item-body-right-switch') });

export function ListIosItemBodyRightSwitch(props: SwitchIosProps) {
  return <StyledSwitch {...props}/>;
}
