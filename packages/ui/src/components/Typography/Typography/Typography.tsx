import type { ValidComponent } from 'solid-js';
import { Dynamic, type DynamicProps } from 'solid-js/web';

import type { WithOptionalClasses } from '@/css/types.js';
import { omitProps } from '@/helpers/omitProps.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import { bem } from '@/css/bem.js';
import { cnCreate } from '@/css/cnCreate.js';
import { pickProps } from '@/helpers/pickProps.js';

import './Typography.scss';

export type TypographyElementKey = 'root';
export type TypographyAlign = 'left' | 'right' | 'center';
export type TypographyProps<C extends ValidComponent> =
  & DynamicProps<C>
  & WithOptionalClasses<TypographyElementKey, TypographyProps<C>>
  & {
  /**
   * Text alignment.
   */
  align?: TypographyAlign;
  /**
   * Should all letters be upper-cased.
   */
  caps?: boolean;
  /**
   * Draw a strikethrough line.
   */
  strikethrough?: boolean;
};

const [b] = bem('tgui-typography');

/**
 * Represents a basic component used to render a text.
 */
export function Typography<C extends ValidComponent>(props: TypographyProps<C>) {
  const $cn = cnCreate(
    props as TypographyProps<ValidComponent>, {
      root: v => [
        v.class,
        b(pickProps(v, ['caps', 'strikethrough']), v.align && `align-${v.align}`),
      ],
    },
  );
  const propsNoClasses = omitClasses(props);
  return (
    <Dynamic
      {...typeof props.component === 'function'
        // If a component was passed, we are rendering it along with the computed classname.
        ? propsNoClasses
        // If an intrinsic element was passed, we omit every Typography-specific property.
        : omitProps(propsNoClasses, ['caps', 'strikethrough', 'align']) as any}
      class={$cn().root}
    />
  );
}
