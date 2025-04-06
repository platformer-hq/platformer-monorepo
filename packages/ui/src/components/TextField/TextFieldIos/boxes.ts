import { slotGen } from 'solid-utils';

import type {
  TextFieldIosPlaceholderProps,
} from './TextFieldIosPlaceholder/TextFieldIosPlaceholder.js';
import type { TextFieldIosInputProps } from './TextFieldIosInput/TextFieldIosInput.js';
import type { TextFieldIosClearProps } from './TextFieldIosClear/TextFieldIosClear.js';

const [Box, filterBox] = slotGen<{
  input: TextFieldIosInputProps;
  placeholder: TextFieldIosPlaceholderProps;
  clear: TextFieldIosClearProps;
}>();

export { filterBox };
export const TextFieldIosInput = Box('input');
export const TextFieldIosClear = Box('clear');
export const TextFieldIosPlaceholder = Box('placeholder');