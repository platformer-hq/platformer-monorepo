import { Show } from 'solid-js';
import { createWritableMemo } from 'solid-utils';

import { bem } from '@/css/bem.js';
import { cnCreate } from '@/css/cnCreate.js';
import { TypographyIos } from '@/components/Typography/TypographyIos/TypographyIos.js';
import { XmarkFill28 } from '@/icons/common/28/XmarkFill28.js';
import { Magnify24 } from '@/icons/common/24/Magnify24.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import { composeHandlers } from '@/helpers/composeHandlers.js';
import { omitProps } from '@/helpers/omitProps.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import './SearchFieldIos.scss';

const [b, e] = bem('search-field-ios');

export type SearchFieldIosElementKey =
  | 'root'
  | 'searchIcon'
  | 'input'
  | 'inputElement'
  | 'placeholder'
  | 'clear'
  | 'clearIcon';
export type SearchFieldIosProps =
  & WithOptionalClasses<SearchFieldIosElementKey, SearchFieldIosProps>
  & Omit<JSXIntrinsicElementAttrs<'input'>, 'value'>
  & {
  value?: string | number;
  onClear?: () => void;
};

export function SearchFieldIos(props: SearchFieldIosProps) {
  const [$value, setValue] = createWritableMemo(() => props.value || '');
  const $clearShown = () => props.type !== 'number' && !!$value();
  const $cn = cnCreate(props, {
    root: v => [v.class, b()],
    searchIcon: e('search-icon'),
    input: e('input'),
    inputElement: e('input-element'),
    placeholder: e('placeholder'),
    clear: e('clear'),
    clearIcon: e('clear-icon'),
  });

  return (
    <label class={$cn().root}>
      <Magnify24 class={$cn().searchIcon}/>
      <span class={$cn().input}>
        <Show when={!$value() && props.placeholder}>
          {$placeholder => (
            <TypographyIos class={$cn().placeholder} variant="body">
              {$placeholder()}
            </TypographyIos>
          )}
        </Show>
        <input
          {...omitProps(omitClasses(props), ['placeholder'])}
          class={$cn().inputElement}
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
      </span>
    </label>
  );
}