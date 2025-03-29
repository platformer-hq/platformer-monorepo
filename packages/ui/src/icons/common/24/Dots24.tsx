/* eslint-disable */
import { mergeProps, type JSX } from 'solid-js';

type SvgAttributes = JSX.IntrinsicElements['svg'];

export interface Dots24Props extends SvgAttributes {
  /**
   * Icon size. This value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: SvgAttributes['width'];
}

export function Dots24(props: Dots24Props) {
  const merged = mergeProps({ size: 24 }, props);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><path fill="currentColor" d="M12.522 8c1.148 0 2.087-.9 2.087-2s-.94-2-2.087-2-2.087.9-2.087 2 .939 2 2.087 2m0 2c-1.148 0-2.087.9-2.087 2s.939 2 2.087 2 2.087-.9 2.087-2-.94-2-2.087-2m0 6c-1.148 0-2.087.9-2.087 2s.939 2 2.087 2 2.087-.9 2.087-2-.94-2-2.087-2"/></svg>
  );
}
