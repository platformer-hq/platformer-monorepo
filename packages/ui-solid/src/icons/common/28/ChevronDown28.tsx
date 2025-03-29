/* eslint-disable */
import { mergeProps, type JSX } from 'solid-js';

type SvgAttributes = JSX.IntrinsicElements['svg'];

export interface ChevronDown28Props extends SvgAttributes {
  /**
   * Icon size. This value will be passed to the SVG's width and height attributes.
   * @default 28
   */
  size?: SvgAttributes['width'];
}

export function ChevronDown28(props: ChevronDown28Props) {
  const merged = mergeProps({ size: 28 }, props);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M14.707 18.457a1 1 0 0 1-1.414 0l-7.5-7.5a1 1 0 0 1 1.414-1.414L14 16.336l6.793-6.793a1 1 0 1 1 1.414 1.414z" clip-rule="evenodd"/></svg>
  );
}
