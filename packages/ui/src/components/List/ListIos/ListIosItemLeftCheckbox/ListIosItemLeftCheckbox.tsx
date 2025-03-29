import {
  CheckboxIos,
  type CheckboxIosElementKey,
  type CheckboxIosProps,
} from '@/components/Checkbox/CheckboxIos/CheckboxIos.js';
import { styled } from '@/css/styled.js';

import { e } from '../bem.js';

import './ListIosItemLeftCheckbox.scss';

export type ListIosItemLeftCheckboxElementKey = CheckboxIosElementKey;
export type ListIosItemLeftCheckboxProps = CheckboxIosProps;

const StyledCheckbox = styled(CheckboxIos, {
  root: e('item-left-checkbox'),
});

export function ListIosItemLeftCheckbox(props: CheckboxIosProps) {
  return <StyledCheckbox {...props}/>;
}
