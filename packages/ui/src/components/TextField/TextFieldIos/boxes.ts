import { slotGen } from 'solid-utils';

import type {
  TextFieldIosPlaceholderProps,
} from './TextFieldIosPlaceholder/TextFieldIosPlaceholder.js';
import type { TextFieldIosInputProps } from './TextFieldIosInput/TextFieldIosInput.js';
import type { TextFieldIosClearProps } from './TextFieldIosClear/TextFieldIosClear.js';

const [Slot, filterBox] = slotGen<{
  input: TextFieldIosInputProps;
  placeholder: TextFieldIosPlaceholderProps;
  clear: TextFieldIosClearProps;
}>();

/*@__NO_SIDE_EFFECTS__*/
function PureSlot<S extends Parameters<typeof Slot>[0]>(name: S) {
  return Slot(name);
}

export { filterBox };
export const TextFieldIosInput = PureSlot('input');
export const TextFieldIosClear = PureSlot('clear');
export const TextFieldIosPlaceholder = PureSlot('placeholder');