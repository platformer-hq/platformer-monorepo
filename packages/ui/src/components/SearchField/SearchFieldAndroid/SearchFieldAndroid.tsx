import { createSignal, mergeProps, Show } from 'solid-js';
import { createWritableMemo } from '@solid-primitives/memo';

import { bem } from '@/css/bem.js';
import { cnCreate } from '@/css/cnCreate.js';
import { TypographyAndroid } from '@/components/Typography/TypographyAndroid/TypographyAndroid.js';
import { Magnify24 } from '@/icons/common/24/Magnify24.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import { composeHandlers } from '@/helpers/composeHandlers.js';
import { omitProps } from '@/helpers/omitProps.js';
import { signalsToRecord } from '@/helpers/signalsToRecord.js';
import { pickProps } from '@/helpers/pickProps.js';
import { Xmark24 } from '@/icons/index.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import './SearchFieldAndroid.scss';

const [b, e] = bem('search-field-android');

export type SearchFieldAndroidElementKey =
  | 'root'
  | 'searchIcon'
  | 'input'
  | 'inputElement'
  | 'placeholder'
  | 'clear'
  | 'clearIcon';
export type SearchFieldAndroidProps =
  & WithOptionalClasses<SearchFieldAndroidElementKey, SearchFieldAndroidProps & {
    clearShown: boolean;
    focused: boolean;
  }>
  & Omit<JSXIntrinsicElementAttrs<'input'>, 'value'>
  & {
  errored?: boolean;
  value?: string | number;
  onClear?: () => void;
};

export function SearchFieldAndroid(props: SearchFieldAndroidProps) {
  const [$value, setValue] = createWritableMemo(() => props.value || '');
  const [$focused, setFocused] = createSignal(false);
  const $clearShown = () => props.type !== 'number' && !!$value();
  const $cn = cnCreate(
    mergeProps(props, signalsToRecord({
      clearShown: $clearShown,
      focused: $focused,
    })),
    {
      root: v => [v.class, b(pickProps(v, ['focused']))],
      searchIcon: e('search-icon'),
      input: e('input'),
      inputElement: e('input-element'),
      placeholder: e('placeholder'),
      clear: e('clear'),
      clearIcon: e('clear-icon'),
    },
  );

  return (
    <label class={$cn().root}>
      <Magnify24 class={$cn().searchIcon}/>
      <span class={$cn().input}>
        <Show when={!$value() && props.placeholder}>
          {$placeholder => (
            <TypographyAndroid class={$cn().placeholder} variant="body1">
              {$placeholder()}
            </TypographyAndroid>
          )}
        </Show>
        <input
          {...omitProps(omitClasses(props), ['placeholder'])}
          class={$cn().inputElement}
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
      </span>
    </label>
  );
}