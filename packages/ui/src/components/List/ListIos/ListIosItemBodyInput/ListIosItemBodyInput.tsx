import { createMemo, mergeProps, Show } from 'solid-js';
import { createWritableMemo } from '@solid-primitives/memo';

import { cnCreate } from '@/css/cnCreate.js';
import { TypographyIos } from '@/components/Typography/TypographyIos/TypographyIos.jsx';
import { XmarkFill28 } from '@/icons/common/28/XmarkFill28.jsx';
import { omitClasses } from '@/helpers/omitClasses.js';
import { composeHandlers } from '@/helpers/composeHandlers.js';
import { signalsToRecord } from '@/helpers/signalsToRecord.js';
import { omitProps } from '@/helpers/omitProps.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import { e } from '../bem.js';

import './ListIosItemBodyInput.scss';

export type ListIosItemBodyInputElementKey =
  | 'root'
  | 'input'
  | 'placeholder'
  | 'clear'
  | 'clearIcon';
export type ListIosItemBodyInputProps =
  & WithOptionalClasses<ListIosItemBodyInputElementKey, ListIosItemBodyInputProps & {
    clearShown: boolean;
  }>
  & Omit<JSXIntrinsicElementAttrs<'input'>, 'value'>
  & {
  value?: string | number;
  onClear?: () => void;
};

export function ListIosItemBodyInput(props: ListIosItemBodyInputProps) {
  const [$value, setValue] = createWritableMemo(() => props.value || '');
  const $clearShown = createMemo(() => props.type !== 'number' && !!$value());
  const $cn = cnCreate(
    mergeProps(props, signalsToRecord({ clearShown: $clearShown })),
    {
      root: v => [v.class, e('item-body-input')],
      input: e('item-body-input-input'),
      placeholder: e('item-body-input-placeholder'),
      clear: e('item-body-input-clear'),
      clearIcon: e('item-body-input-clear-icon'),
    },
  );

  return (
    <label class={$cn().root}>
      <Show when={!$value() && props.placeholder}>
        {$placeholder => (
          <TypographyIos class={$cn().placeholder} variant="body">
            {$placeholder()}
          </TypographyIos>
        )}
      </Show>
      <input
        {...omitProps(omitClasses(props), ['placeholder'])}
        class={$cn().input}
        value={$value()}
        onInput={composeHandlers(props.onInput, e => {
          setValue(e.target.value);
        })}
      />
      <Show when={$clearShown()}>
        <i
          class={$cn().clear}
          onClick={() => {
            const { onClear } = props;
            setValue('');
            onClear && onClear();
          }}
        >
          <XmarkFill28 class={$cn().clearIcon}/>
        </i>
      </Show>
    </label>
  );
}