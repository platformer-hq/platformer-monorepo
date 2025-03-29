import { mergeProps, ValidComponent } from 'solid-js';

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

import './TypographyIos.scss';

export type TypographyIosWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TypographyIosVariant =
  | 'title1'
  | 'title2'
  | 'title3'
  | 'headline'
  | 'body'
  | 'callout'
  | 'subheadline1'
  | 'subheadline2'
  | 'footnote'
  | 'caption1'
  | 'caption2';
export type TypographyIosProps<C extends ValidComponent> =
  & PartialBy<OmitClasses<TypographyProps<C>>, 'component'>
  & WithOptionalClasses<TypographyElementKey, TypographyIosProps<C>>
  & {
  mono?: boolean;
  monoNumbers?: boolean;
  rounded?: boolean;
  variant?: TypographyIosVariant;
  weight?: TypographyIosWeight;
};

const [b] = bem('tgui-typography-ios');

export function TypographyIos<C extends ValidComponent>(props: TypographyIosProps<C>) {
  const $cn = cnCreate<TypographyIosProps<ValidComponent>>(props, {
    root: ({ weight, variant, monoNumbers, class: className, ...rest }) => [
      className,
      b(
        pickProps(rest, ['mono', 'rounded']),
        monoNumbers && 'mono-numbers',
        weight,
        variant,
      ),
    ],
  });

  const $computedProps = () => mergeProps(
    omitProps(omitClasses(props), [
      'mono',
      'monoNumbers',
      'rounded',
      'weight',
      'variant',
    ]),
    {
      get component() {
        const variant = props.variant || 'body';
        return props.component || ({
          title1: 'h1',
          title2: 'h2',
          title3: 'h3',
        } as Partial<Record<TypographyIosVariant, string>>)[variant] || 'p';
      },
      get class() {
        return $cn().root;
      },
    },
  );

  return <Typography {...$computedProps() as any}/>;
}
