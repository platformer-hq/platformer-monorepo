import { cnCreate } from '@/css/cnCreate.js';
import { omitProps } from '@/helpers/omitProps.js';
import { omitClasses } from '@/helpers/omitClasses.js';
import { TypographyAndroid } from '@/components/Typography/TypographyAndroid/TypographyAndroid.js';
import type { WithOptionalClasses } from '@/css/types.js';
import type { JSXIntrinsicElementAttrs } from '@/types/jsx.js';

import { e } from '../bem.js';

import './ListAndroidItemBodyLeftLabel.scss';

export type ListAndroidItemBodyLeftLabelElementKey = 'root';
export type ListAndroidItemBodyLeftLabelProps =
  & JSXIntrinsicElementAttrs<'p'>
  & WithOptionalClasses<ListAndroidItemBodyLeftLabelElementKey, ListAndroidItemBodyLeftLabelProps>
  & {
  /**
   * True if the medium font-weight should be applied.
   * @default false
   */
  medium?: boolean;
};

export function ListAndroidItemBodyLeftLabel(props: ListAndroidItemBodyLeftLabelProps) {
  const $cn = cnCreate(props, {
    root: v => [v.class, e('item-body-left-label')],
  });
  return (
    <TypographyAndroid
      {...omitProps(omitClasses(props), ['medium'])}
      variant="body1"
      component="p"
      class={$cn().root}
      weight={props.medium ? 'medium' : undefined}
    />
  );
}