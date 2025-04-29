import { slotGen } from 'solid-utils';

import type { ListAndroidItemProps } from './ListAndroidItem/ListAndroidItem.js';

import type { ListAndroidItemLeftProps } from './ListAndroidItemLeft/ListAndroidItemLeft.js';
import type {
  ListAndroidItemLeftLabelProps,
} from './ListAndroidItemLeftLabel/ListAndroidItemLeftLabel.js';
import type {
  ListAndroidItemLeftIconProps,
} from './ListAndroidItemLeftIcon/ListAndroidItemLeftIcon.js';

import type {
  ListAndroidItemBodyInputProps,
} from './ListAndroidItemBodyInput/ListAndroidItemBodyInput.js';

import type { ListAndroidItemBodyProps } from './ListAndroidItemBody/ListAndroidItemBody.js';
import type {
  ListAndroidItemBodyLeftProps,
} from './ListAndroidItemBodyLeft/ListAndroidItemBodyLeft.js';
import type {
  ListAndroidItemBodyLeftLabelProps,
} from './ListAndroidItemBodyLeftLabel/ListAndroidItemBodyLeftLabel.js';
import type {
  ListAndroidItemBodyLeftSubtitleProps,
} from './ListAndroidItemBodyLeftSubtitle/ListAndroidItemBodyLeftSubtitle.js';

import type {
  ListAndroidItemBodyRightProps,
} from './ListAndroidItemBodyRight/ListAndroidItemBodyRight.js';
import type {
  ListAndroidItemBodyRightLabelProps,
} from './ListAndroidItemBodyRightLabel/ListAndroidItemBodyRightLabel.js';
import type {
  ListAndroidItemBodyRightChevronProps,
} from './ListAndroidItemBodyRightChevron/ListAndroidItemBodyRightChevron.js';
import type {
  ListAndroidItemBodyRightCounterProps,
} from './ListAndroidItemBodyRightCounter/ListAndroidItemBodyRightCounter.js';
import type {
  ListAndroidItemBodyRightCheckmarkProps,
} from './ListAndroidItemBodyRightCheckmark/ListAndroidItemBodyRightCheckmark.js';
import type {
  ListAndroidItemBodyRightSwitchProps,
} from './ListAndroidItemBodyRightSwitch/ListAndroidItemBodyRightSwitch.js';
import type {
  ListAndroidItemBodyRightClearProps,
} from './ListAndroidItemBodyRightClear/ListAndroidItemBodyRightClear.js';
import type {
  ListAndroidItemLeftCheckboxProps,
} from './ListAndroidItemLeftCheckbox/ListAndroidItemLeftCheckbox.js';

const [Slot, filterSlots] = slotGen<{
  body: ListAndroidItemBodyProps;
  bodyInput: ListAndroidItemBodyInputProps;
  bodyLeft: ListAndroidItemBodyLeftProps;
  bodyLeftLabel: ListAndroidItemBodyLeftLabelProps;
  bodyLeftSubtitle: ListAndroidItemBodyLeftSubtitleProps;
  bodyRight: ListAndroidItemBodyRightProps;
  bodyRightCheckmark: ListAndroidItemBodyRightCheckmarkProps;
  bodyRightChevron: ListAndroidItemBodyRightChevronProps;
  bodyRightClear: ListAndroidItemBodyRightClearProps;
  bodyRightCounter: ListAndroidItemBodyRightCounterProps;
  bodyRightLabel: ListAndroidItemBodyRightLabelProps;
  bodyRightSwitch: ListAndroidItemBodyRightSwitchProps;
  left: ListAndroidItemLeftProps;
  leftCheckbox: ListAndroidItemLeftCheckboxProps;
  leftIcon: ListAndroidItemLeftIconProps;
  leftLabel: ListAndroidItemLeftLabelProps;
  root: ListAndroidItemProps;
}>();

export { filterSlots };
export const ListAndroidItem = Slot('root');
export const ListAndroidItemLeft = Slot('left');
export const ListAndroidItemLeftCheckbox = Slot('leftCheckbox');
export const ListAndroidItemLeftIcon = Slot('leftIcon');
export const ListAndroidItemLeftLabel = Slot('leftLabel');
export const ListAndroidItemBody = Slot('body');
export const ListAndroidItemBodyLeft = Slot('bodyLeft');
export const ListAndroidItemBodyLeftLabel = Slot('bodyLeftLabel');
export const ListAndroidItemBodyLeftSubtitle = Slot('bodyLeftSubtitle');
export const ListAndroidItemBodyRight = Slot('bodyRight');
export const ListAndroidItemBodyRightChevron = Slot('bodyRightChevron');
export const ListAndroidItemBodyRightLabel = Slot('bodyRightLabel');
export const ListAndroidItemBodyRightCheckmark = Slot('bodyRightCheckmark');
export const ListAndroidItemBodyRightClear = Slot('bodyRightClear');
export const ListAndroidItemBodyRightSwitch = Slot('bodyRightSwitch');
export const ListAndroidItemBodyInput = Slot('bodyInput');
export const ListAndroidItemRightCounter = Slot('bodyRightCounter');
