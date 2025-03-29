/* eslint-disable */
import { mergeProps, type JSX } from 'solid-js';

type SvgAttributes = JSX.IntrinsicElements['svg'];

export interface Levels30Props extends SvgAttributes {
  /**
   * Icon size. This value will be passed to the SVG's width and height attributes.
   * @default 30
   */
  size?: SvgAttributes['width'];
}

export function Levels30(props: Levels30Props) {
  const merged = mergeProps({ size: 30 }, props);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" width={merged.size} height={merged.size} {...props}><rect width="30" height="30" fill="currentColor" rx="7"/><path fill="#fff" fill-rule="evenodd" d="M10.5 13a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M24 14.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-10 6a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0" clip-rule="evenodd"/></svg>
  );
}
