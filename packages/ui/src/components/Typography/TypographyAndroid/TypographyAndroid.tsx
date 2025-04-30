import type { ValidComponent } from 'solid-js';

import {
  Typography,
  type TypographyElementKey,
  type TypographyProps,
} from '@/components/Typography/Typography/Typography.js';
import type { WithOptionalClasses, OmitClasses } from '@/css/types.js';
import type { PartialBy } from '@/types/utils.js';
import { omitProps } from '@/helpers/omitProps.js';
import { bem } from '@/css/bem.js';
import { pickProps } from '@/helpers/pickProps.js';
import { cnCreate } from '@/css/cnCreate.js';
import { omitClasses } from '@/helpers/omitClasses.js';

import './TypographyAndroid.scss';

export type TypographyAndroidWeight = 'regular' | 'medium';
export type TypographyAndroidVariant =
  | 'headline5'
  | 'headline6'
  | 'headline7'
  | 'body1'
  | 'subtitle1'
  | 'subtitle2'
  | 'button1'
  | 'button2'
  | 'caption1'
  | 'caption2';

export type TypographyAndroidProps<C extends ValidComponent> =
  & PartialBy<OmitClasses<TypographyProps<C>>, 'component'>
  & WithOptionalClasses<TypographyElementKey, TypographyAndroidProps<C>>
  & {
  /**
   * Use monospace font.
   */
  mono?: boolean;
  /**
   * A specific font settings variation.
   * @default "body1"
   */
  variant?: TypographyAndroidVariant;
  /**
   * Font weight.
   */
  weight?: TypographyAndroidWeight;
};

const [b] = bem('tgui-typography-android');

export function TypographyAndroid<C extends ValidComponent>(props: TypographyAndroidProps<C>) {
  const $cn = cnCreate<TypographyAndroidProps<ValidComponent>>(props, {
    root: v => [
      v.class,
      b(pickProps(v, ['mono']), v.weight, v.variant),
    ],
  });
  return (
    <Typography
      {...omitProps(omitClasses(props), ['mono', 'weight', 'variant']) as any}
      component={props.component || ({
        headline5: 'h1',
        headline6: 'h2',
        headline7: 'h3',
      } as Partial<Record<TypographyAndroidVariant, string>>)[props.variant || 'body1'] || 'p'}
      class={$cn().root}
    />
  );
}