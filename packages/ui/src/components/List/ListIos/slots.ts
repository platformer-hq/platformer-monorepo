import { slotGen } from 'solid-utils';

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
import type {
  ListIosItemLeftCheckboxProps,
} from './ListIosItemLeftCheckbox/ListIosItemLeftCheckbox.js';

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
import {
  ListIosItemBodyRightRadioProps
} from './ListIosItemBodyRightRadio/ListIosItemBodyRightRadio.js';
import type {
  ListIosItemBodyRightClearProps,
} from './ListIosItemBodyRightClear/ListIosItemBodyRightClear.js';

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
  bodyRightRadio: ListIosItemBodyRightRadioProps;
  left: ListIosItemLeftProps;
  leftCheckbox: ListIosItemLeftCheckboxProps;
  leftIcon: ListIosItemLeftIconProps;
  leftLabel: ListIosItemLeftLabelProps;
  root: ListIosItemProps;
}>();

/*@__NO_SIDE_EFFECTS__*/
function PureSlot<S extends Parameters<typeof Slot>[0]>(name: S) {
  return Slot(name);
}

export { filterSlots };
export const ListIosItem = PureSlot('root');
export const ListIosItemLeft = PureSlot('left');
export const ListIosItemLeftCheckbox = PureSlot('leftCheckbox');
export const ListIosItemLeftIcon = PureSlot('leftIcon');
export const ListIosItemLeftLabel = PureSlot('leftLabel');
export const ListIosItemBody = PureSlot('body');
export const ListIosItemBodyLeft = PureSlot('bodyLeft');
export const ListIosItemBodyLeftLabel = PureSlot('bodyLeftLabel');
export const ListIosItemBodyLeftSubtitle = PureSlot('bodyLeftSubtitle');
export const ListIosItemBodyRight = PureSlot('bodyRight');
export const ListIosItemBodyRightChevron = PureSlot('bodyRightChevron');
export const ListIosItemBodyRightLabel = PureSlot('bodyRightLabel');
export const ListIosItemBodyRightCheckmark = PureSlot('bodyRightCheckmark');
export const ListIosItemBodyRightClear = PureSlot('bodyRightClear');
export const ListIosItemBodyRightSwitch = PureSlot('bodyRightSwitch');
export const ListIosItemBodyRightRadio = PureSlot('bodyRightRadio');
export const ListIosItemBodyInput = PureSlot('bodyInput');
export const ListIosItemRightCounter = PureSlot('bodyRightCounter');
