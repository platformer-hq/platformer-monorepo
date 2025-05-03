import {
  RadioAndroid,
  type RadioAndroidElementKey,
  type RadioAndroidProps,
} from '@/components/Radio/RadioAndroid/RadioAndroid.js';
import { styled } from '@/css/styled.js';

import { e } from '../bem.js';

export type ListAndroidItemBodyRightRadioElementKey = RadioAndroidElementKey;
export type ListAndroidItemBodyRightRadioProps = RadioAndroidProps;

import './ListAndroidItemBodyRightRadio.scss';

const StyledRadio = styled(RadioAndroid, { root: e('item-body-right-radio') });

export function ListAndroidItemBodyRightRadio(props: RadioAndroidProps) {
  return <StyledRadio {...props}/>;
}
