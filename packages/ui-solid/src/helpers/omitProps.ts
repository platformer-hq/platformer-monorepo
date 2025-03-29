import { type SplitProps, splitProps } from 'solid-js';

export type OmitPropsResult<Props, Key extends keyof Props> = SplitProps<Props, [[Key]]>[1];

/**
 * Omits specified properties from a properties' object saving reactivity.
 * @param props - properties.
 * @param keys - keys to omit.
 */
export function omitProps<Props extends Record<any, any>, Keys extends keyof Props>(
  props: Props,
  keys: readonly Keys[],
): OmitPropsResult<Props, Keys> {
  return splitProps(props, keys)[1];
}
