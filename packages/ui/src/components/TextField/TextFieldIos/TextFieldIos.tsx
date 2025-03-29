import {
  type FlowProps,
  type JSX,
  createMemo,
  createSignal,
  Show,
} from 'solid-js';

import { omitProps } from '@/helpers/omitProps.js';
import { TextFieldIosPlaceholder } from './TextFieldIosPlaceholder/TextFieldIosPlaceholder.js';
import { cnCreate } from '@/css/cnCreate.js';
import { composeHandlers } from '@/helpers/composeHandlers.js';
import type { WithOptionalClasses } from '@/css/types.js';

import { filterBox } from './boxes.js';
import { b, e } from './bem.js';
import { TextFieldIosInput } from './TextFieldIosInput/TextFieldIosInput.js';
import { TextFieldIosClear } from './TextFieldIosClear/TextFieldIosClear.js';

import './TextFieldIos.scss';

export type TextFieldIosElementKey = 'root' | 'background';
export type TextFieldIosProps =
  & WithOptionalClasses<TextFieldIosElementKey, TextFieldIosProps>
  & FlowProps
  & JSX.IntrinsicElements['label'];

export function TextFieldIos(props: TextFieldIosProps) {
  const $clear = createMemo(() => filterBox(props, 'clear'));
  const $input = createMemo(() => filterBox(props, 'input'));
  const input = $input();
  const [$value, setValue] = createSignal(input && input.value || '');

  const $cn = cnCreate(props, {
    root: v => [v.class, b()],
    background: e('background'),
  });

  return (
    <label {...omitProps(props, ['classes'])} class={$cn().root}>
      <span class={$cn().background}/>
      <Show when={!$value() && filterBox(props, 'placeholder')}>
        {$box => <TextFieldIosPlaceholder {...$box()}/>}
      </Show>
      <Show when={filterBox(props, 'input')}>
        {$box => (
          <TextFieldIosInput
            {...$box()}
            onInput={composeHandlers($box().onInput, e => {
              setValue(e.target.value);
            })}
            value={$value()}
            clearShown={!!($value() && $clear())}
          />
        )}
      </Show>
      <Show when={$clear()}>
        {$box => (
          <TextFieldIosClear
            onClick={composeHandlers($box().onClick, () => {
              setValue('');
            })}
          />
        )}
      </Show>
    </label>
  );
}
