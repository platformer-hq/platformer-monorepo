import type { Component } from 'solid-js';

import { cnCreate } from '@/css/cnCreate.js';
import type { PartialBy } from '@/types/utils.js';

import type { WithOptionalClasses, OmitClasses, Classes, } from './types.js';

export type StyledComponentProps<Props extends WithOptionalClasses<any, any>> =
  Props extends infer P extends Props
    ? PartialBy<P, 'classes'>
    : never;

export type StyledClasses<Props extends WithOptionalClasses<any, any>> =
  Classes<keyof Exclude<Props['classes'], undefined> & string, OmitClasses<Props>>;

/**
 * Returns Higher Order Component computing elements class names based on the properties'
 * classes property, and passing them to the wrapped component.
 * @param Component - wrapped component.
 * @param classes - classes map.
 *
 * @example
 * const MyCheckbox = styled(Checkbox, {
 *   root: 'my-checkbox',
 *   input: 'my-checkbox__input',
 *   ...
 * });
 */
export function styled<Props extends WithOptionalClasses<any, any>>(
  Component: Component<Props>,
  classes: StyledClasses<Props>,
): Component<StyledComponentProps<Props>> {
  return props => {
    return <Component {...props as any} classes={cnCreate(props, classes as any)()}/>;
  };
}

