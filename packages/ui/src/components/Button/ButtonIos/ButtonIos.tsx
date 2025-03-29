import {
  type Component,
  type JSX,
  type JSXElement,
  mergeProps,
  Show,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type { WithOptionalClasses } from '@/css/types.js';
import { bem } from '@/css/bem.js';
import { pickProps } from '@/helpers/pickProps.js';
import { TypographyIos } from '@/components/Typography/TypographyIos/TypographyIos.js';
import { cnCreate } from '@/css/cnCreate.js';
import type { PartialBy, RequiredBy } from '@/types/utils.js';
import { signalsToRecord } from '@/helpers/signalsToRecord.js';
import { composeHandlers } from '@/helpers/composeHandlers.js';
import { useActiveStateHandler } from '@/hooks/useActiveStateHandler.js';

import './ButtonIos.scss';

type CommonVariantProps<Variant extends ButtonIosVariant> = {
  /**
   * Button variant.
   */
  variant: Variant;
  /**
   * True if the button should take all allowed horizontal space.
   * @default false
   */
  fullWidth?: boolean;
} & ({
  /**
   * Component palette description.
   * @default 'filled'
   */
  theme?: ButtonIosTheme;
} | {
  theme?: 'filled';
  /**
   * True if the button should have a shining effect.
   * @default false
   */
  shine?: boolean;
});

type RegularVariantProps = PartialBy<CommonVariantProps<'regular'>, 'variant'>
  & {
  /**
   * Icon to display in the left part of the button content.
   */
  Icon?: ButtonIosIcon;
  /**
   * True if the spinner should be shown.
   * @default false.
   */
  spinner?: boolean;
};

type MultilineVariantProps = CommonVariantProps<'multiline'> & {
  /**
   * Icon to display below the button content.
   */
  Icon: ButtonIosIcon;
};

export type ButtonIosIcon = Component<{ class?: string }> | JSXElement;
export type ButtonIosVariant = 'regular' | 'multiline' | 'small-rounded' | 'small-squared';
export type ButtonIosTheme = 'filled' | 'tinted' | 'plain' | 'gray';
export type ButtonIosElementKey = 'root' | 'icon' | 'iconImage' | 'content' | 'shine';
export type ButtonIosCoreProps =
  & JSX.IntrinsicElements['button']
  & (
  | RegularVariantProps
  | MultilineVariantProps
  | CommonVariantProps<'small-rounded'>
  | CommonVariantProps<'small-squared'>
  );
export type ButtonIosProps =
  & ButtonIosCoreProps
  & WithOptionalClasses<
  ButtonIosElementKey,
  RequiredBy<ButtonIosCoreProps, 'variant' | 'theme'> & {
  spinner: boolean;
  shine: boolean;
  active: boolean;
}>;

const [b, e] = bem('tgui-button-ios');

export function ButtonIos(props: ButtonIosProps) {
  const $variant = () => props.variant || 'regular';
  const $theme = () => props.theme || 'filled';
  const $shine = () => $theme() === 'filled' && (props as any).shine;
  const $spinner = () => 'spinner' in props && !!props.spinner;

  const [$active, onPointerDown] = useActiveStateHandler();
  const $cn = cnCreate(
    mergeProps(props, signalsToRecord({
      variant: $variant,
      theme: $theme,
      spinner: $spinner,
      shine: $shine,
      active: $active,
    })),
    {
      root: v => [
        v.class,
        b(
          pickProps(v, ['disabled', 'active']),
          v.theme,
          v.shine && 'filled-shine',
          v.variant,
          v.fullWidth && 'full-width',
        ),
      ],
      icon: v => e('icon', v.variant),
      iconImage: e('icon-image'),
      content: e('content'),
      shine: e('shine'),
    },
  );

  // TODO: Implement spinner.

  return (
    <button
      {...props}
      class={$cn().root}
      onPointerDown={composeHandlers(onPointerDown, props.onPointerDown)}
    >
      <Show
        when={['regular', 'multiline'].includes($variant()) && 'Icon' in props && props.Icon}
      >
        {$icon => {
          const $Icon = () => {
            const icon = $icon();
            return typeof icon === 'function'
              ? icon as Component<{ class?: string }>
              : () => icon as JSXElement;
          };
          return (
            <i class={$cn().icon}>
              <Dynamic component={$Icon()} class={$cn().iconImage}/>
            </i>
          );
        }}
      </Show>
      <Show when={props.children}>
        <TypographyIos
          component="span"
          class={$cn().content}
          variant={({
            regular: 'body',
            multiline: 'caption2',
            'small-rounded': 'subheadline1',
            'small-squared': 'subheadline2',
          } as const)[$variant()]}
          weight={$variant() === 'multiline' ? 'medium' : 'semibold'}
          rounded={$variant() === 'small-rounded'}
        >
          {props.children}
        </TypographyIos>
      </Show>
    </button>
  );
}