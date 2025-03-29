import { slotGen } from '@/slots/slots.js';

import type { ListIosItemProps } from './ListIosItem/ListIosItem.js';

import type { ListIosItemLeftProps } from './ListIosItemLeft/ListIosItemLeft.js';
import type { ListIosItemLeftLabelProps } from './ListIosItemLeftLabel/ListIosItemLeftLabel.js';
import type { ListIosItemLeftIconProps } from './ListIosItemLeftIcon/ListIosItemLeftIcon.js';

import type {
  ListIosItemBodyInputProps,
} from './ListIosItemBodyInput/ListIosItemBodyInput.js';

import type { ListIosItemBodyProps } from './ListIosItemBody/ListIosItemBody.js';
import type { ListIosItemBodyLeftProps } from './ListIosItemBodyLeft/ListIosItemBodyLeft.js';
import type {
  ListIosItemBodyLeftLabelProps,
} from './ListIosItemBodyLeftLabel/ListIosItemBodyLeftLabel.js';
import type {
  ListIosItemBodyLeftSubtitleProps,
} from './ListIosItemBodyLeftSubtitle/ListIosItemBodyLeftSubtitle.js';

import type { ListIosItemBodyRightProps } from './ListIosItemBodyRight/ListIosItemBodyRight.js';
import type {
  ListIosItemBodyRightLabelProps,
} from './ListIosItemBodyRightLabel/ListIosItemBodyRightLabel.js';
import type {
  ListIosItemBodyRightChevronProps,
} from './ListIosItemBodyRightChevron/ListIosItemBodyRightChevron.js';
import type {
  ListIosItemBodyRightCounterProps,
} from './ListIosItemBodyRightCounter/ListIosItemBodyRightCounter.js';
import type {
  ListIosItemBodyRightCheckmarkProps,
} from './ListIosItemBodyRightCheckmark/ListIosItemBodyRightCheckmark.js';
import type {
  ListIosItemBodyRightSwitchProps,
} from './ListIosItemBodyRightSwitch/ListIosItemBodyRightSwitch.js';
import type {
  ListIosItemBodyRightClearProps,
} from './ListIosItemBodyRightClear/ListIosItemBodyRightClear.js';
import type {
  ListIosItemLeftCheckboxProps,
} from './ListIosItemLeftCheckbox/ListIosItemLeftCheckbox.js';

const [Slot, filterSlots] = slotGen<{
  body: ListIosItemBodyProps;
  bodyInput: ListIosItemBodyInputProps;
  bodyLeft: ListIosItemBodyLeftProps;
  bodyLeftLabel: ListIosItemBodyLeftLabelProps;
  bodyLeftSubtitle: ListIosItemBodyLeftSubtitleProps;
  bodyRight: ListIosItemBodyRightProps;
  bodyRightCheckmark: ListIosItemBodyRightCheckmarkProps;
  bodyRightChevron: ListIosItemBodyRightChevronProps;
  bodyRightClear: ListIosItemBodyRightClearProps;
  bodyRightCounter: ListIosItemBodyRightCounterProps;
  bodyRightLabel: ListIosItemBodyRightLabelProps;
  bodyRightSwitch: ListIosItemBodyRightSwitchProps;
  left: ListIosItemLeftProps;
  leftCheckbox: ListIosItemLeftCheckboxProps;
  leftIcon: ListIosItemLeftIconProps;
  leftLabel: ListIosItemLeftLabelProps;
  root: ListIosItemProps;
}>();

export { filterSlots };
export const ListIosItem = Slot('root');
export const ListIosItemLeft = Slot('left');
export const ListIosItemLeftCheckbox = Slot('leftCheckbox');
export const ListIosItemLeftIcon = Slot('leftIcon');
export const ListIosItemLeftLabel = Slot('leftLabel');
export const ListIosItemBody = Slot('body');
export const ListIosItemBodyLeft = Slot('bodyLeft');
export const ListIosItemBodyLeftLabel = Slot('bodyLeftLabel');
export const ListIosItemBodyLeftSubtitle = Slot('bodyLeftSubtitle');
export const ListIosItemBodyRight = Slot('bodyRight');
export const ListIosItemBodyRightChevron = Slot('bodyRightChevron');
export const ListIosItemBodyRightLabel = Slot('bodyRightLabel');
export const ListIosItemBodyRightCheckmark = Slot('bodyRightCheckmark');
export const ListIosItemBodyRightClear = Slot('bodyRightClear');
export const ListIosItemBodyRightSwitch = Slot('bodyRightSwitch');
export const ListIosItemBodyInput = Slot('bodyInput');
export const ListIosItemRightCounter = Slot('bodyRightCounter');
