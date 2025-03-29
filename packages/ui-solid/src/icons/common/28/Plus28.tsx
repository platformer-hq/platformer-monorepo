/* eslint-disable */
import { mergeProps, type JSX } from 'solid-js';

type SvgAttributes = JSX.IntrinsicElements['svg'];

export interface Plus28Props extends SvgAttributes {
  /**
   * Icon size. This value will be passed to the SVG's width and height attributes.
   * @default 28
   */
  size?: SvgAttributes['width'];
}

export function Plus28(props: Plus28Props) {
  const merged = mergeProps({ size: 28 }, props);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M14 24a1 1 0 0 1-1-1v-8H5a1 1 0 1 1 0-2h8V5a1 1 0 1 1 2 0v8h8a1 1 0 1 1 0 2h-8v8a1 1 0 0 1-1 1" clip-rule="evenodd"/></svg>
  );
}
