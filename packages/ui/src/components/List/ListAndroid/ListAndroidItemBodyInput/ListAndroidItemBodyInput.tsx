import { createMemo, createSignal, mergeProps, Show } from 'solid-js';
import { createWritableMemo } from '@solid-primitives/memo';

import { cnCreate } from '@/css/cnCreate.js';
import { TypographyAndroid } from '@/components/Typography/TypographyAndroid/TypographyAndroid.jsx';
import { Xmark24 } from '@/icons/common/24/Xmark24.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import { composeHandlers } from '@/helpers/composeHandlers.js';
import { signalsToRecord } from '@/helpers/signalsToRecord.js';
import { omitProps } from '@/helpers/omitProps.js';
import { pickProps } from '@/helpers/pickProps.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import { eGen } from '../bem.js';

import './ListAndroidItemBodyInput.scss';

export type ListAndroidItemBodyInputElementKey =
  | 'root'
  | 'input'
  | 'placeholder'
  | 'clear'
  | 'clearIcon';
export type ListAndroidItemBodyInputProps =
  & WithOptionalClasses<ListAndroidItemBodyInputElementKey, ListAndroidItemBodyInputProps & {
    clearShown: boolean;
    focused: boolean;
  }>
  & Omit<JSXIntrinsicElementAttrs<'input'>, 'value'>
  & {
  errored?: boolean;
  onClear?: () => void;
  value?: string | number;
};

const e = eGen('item-body-input');

export function ListAndroidItemBodyInput(props: ListAndroidItemBodyInputProps) {
  const [$value, setValue] = createWritableMemo(() => props.value || '');
  const [$focused, setFocused] = createSignal(false);
  const $clearShown = createMemo(() => props.type !== 'number' && !!$value() && !props.disabled);
  const $cn = cnCreate(
    mergeProps(props, signalsToRecord({
      clearShown: $clearShown,
      focused: $focused,
    })),
    {
      root: v => [v.class, e(undefined, pickProps(v, ['focused']))],
      input: e('input'),
      placeholder: e('placeholder'),
      clear: e('clear'),
      clearIcon: e('clear-icon'),
    },
  );

  return (
    <label class={$cn().root}>
      <Show when={!$value() && props.placeholder}>
        {$placeholder => (
          <TypographyAndroid class={$cn().placeholder} variant="body1">
            {$placeholder()}
          </TypographyAndroid>
        )}
      </Show>
      <input
        {...omitProps(omitClasses(props), ['placeholder'])}
        class={$cn().input}
        value={$value()}
        onFocus={composeHandlers(props.onFocus, () => {
          setFocused(true);
        })}
        onBlur={composeHandlers(props.onBlur, () => {
          setFocused(false);
        })}
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
          <Xmark24 class={$cn().clearIcon}/>
        </i>
      </Show>
    </label>
  );
}