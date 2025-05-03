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
import {
  ListAndroidItemBodyRightRadioProps
} from './ListAndroidItemBodyRightRadio/ListAndroidItemBodyRightRadio.js';
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
  bodyRightRadio: ListAndroidItemBodyRightRadioProps;
  left: ListAndroidItemLeftProps;
  leftCheckbox: ListAndroidItemLeftCheckboxProps;
  leftIcon: ListAndroidItemLeftIconProps;
  leftLabel: ListAndroidItemLeftLabelProps;
  root: ListAndroidItemProps;
}>();

/*@__NO_SIDE_EFFECTS__*/
function PureSlot<S extends Parameters<typeof Slot>[0]>(name: S) {
  return Slot(name);
}

export { filterSlots };
export const ListAndroidItem = PureSlot('root');
export const ListAndroidItemLeft = PureSlot('left');
export const ListAndroidItemLeftCheckbox = PureSlot('leftCheckbox');
export const ListAndroidItemLeftIcon = PureSlot('leftIcon');
export const ListAndroidItemLeftLabel = PureSlot('leftLabel');
export const ListAndroidItemBody = PureSlot('body');
export const ListAndroidItemBodyLeft = PureSlot('bodyLeft');
export const ListAndroidItemBodyLeftLabel = PureSlot('bodyLeftLabel');
export const ListAndroidItemBodyLeftSubtitle = PureSlot('bodyLeftSubtitle');
export const ListAndroidItemBodyRight = PureSlot('bodyRight');
export const ListAndroidItemBodyRightChevron = PureSlot('bodyRightChevron');
export const ListAndroidItemBodyRightLabel = PureSlot('bodyRightLabel');
export const ListAndroidItemBodyRightCheckmark = PureSlot('bodyRightCheckmark');
export const ListAndroidItemBodyRightClear = PureSlot('bodyRightClear');
export const ListAndroidItemBodyRightSwitch = PureSlot('bodyRightSwitch');
export const ListAndroidItemBodyRightRadio = PureSlot('bodyRightRadio');
export const ListAndroidItemBodyInput = PureSlot('bodyInput');
export const ListAndroidItemRightCounter = PureSlot('bodyRightCounter');
