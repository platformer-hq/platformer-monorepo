import type { Accessor } from 'solid-js';

import type { WithOptionalClasses } from '@/css/types.js';
import { accessor } from '@/helpers/accessor.js';

/**
 * @returns A getter retrieving classes from properties.
 * @param props - properties to retrieve classes from.
 */
export function cnAccessor<P extends WithOptionalClasses<any, any>>(props: P): Accessor<P['classes']> {
  return accessor(props, 'classes');
}