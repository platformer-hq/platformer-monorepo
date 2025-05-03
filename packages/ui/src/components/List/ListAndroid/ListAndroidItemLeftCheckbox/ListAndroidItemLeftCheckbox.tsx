import {
  CheckboxAndroid,
  type CheckboxAndroidElementKey,
  type CheckboxAndroidProps,
} from '@/components/Checkbox/CheckboxAndroid/CheckboxAndroid.js';
import { styled } from '@/css/styled.js';

import { e } from '../bem.js';

import './ListAndroidItemLeftCheckbox.scss';

export type ListAndroidItemLeftCheckboxElementKey = CheckboxAndroidElementKey;
export type ListAndroidItemLeftCheckboxProps = CheckboxAndroidProps;

const StyledCheckbox = styled(CheckboxAndroid, {
  root: e('item-left-checkbox'),
});

export function ListAndroidItemLeftCheckbox(props: CheckboxAndroidProps) {
  return <StyledCheckbox {...props}/>;
}
