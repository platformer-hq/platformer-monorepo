import type { WithOptionalClasses } from '@/css/types.js';
import { omitProps } from '@/helpers/omitProps.js';

export function omitClasses<P extends WithOptionalClasses<any, any>>(props: P) {
  return omitProps(props, ['classes']);
}