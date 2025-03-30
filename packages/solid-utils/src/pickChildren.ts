import { pickProps, type PickResult } from './pickProps.js';

/**
 * Safely picks children prop saving picked object reactivity.
 * @param props - properties.
 */
export function pickChildren<Props extends Record<any, any>>(
  props: Props,
): PickResult<Props, 'children'>;

/**
 * Safely picks children prop saving picked object reactivity.
 * @param props - properties.
 * @param keys - additional keys to pick.
 */
export function pickChildren<Props extends Record<any, any>, Keys extends keyof Props>(
  props: Props,
  keys: readonly Keys[],
): PickResult<Props, Keys | 'children'>;

export function pickChildren<Props extends Record<any, any>, Keys extends keyof Props>(
  props: Record<any, any>,
  keys?: readonly Keys[],
): PickResult<Props, Keys | 'children'> {
  return pickProps(props, ['children', ...(keys || [])]);
}
