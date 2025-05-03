import {
  RadioIos,
  type RadioIosElementKey,
  type RadioIosProps,
} from '@/components/Radio/RadioIos/RadioIos.js';
import { styled } from '@/css/styled.js';

import { e } from '../bem.js';

export type ListIosItemBodyRightRadioElementKey = RadioIosElementKey;
export type ListIosItemBodyRightRadioProps = RadioIosProps;

import './ListIosItemBodyRightRadio.scss';

const StyledRadio = styled(RadioIos, { root: e('item-body-right-radio') });

export function ListIosItemBodyRightRadio(props: RadioIosProps) {
  return <StyledRadio {...props}/>;
}
