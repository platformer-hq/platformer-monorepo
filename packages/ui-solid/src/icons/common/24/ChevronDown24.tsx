/* eslint-disable */
import { mergeProps, type JSX } from 'solid-js';

type SvgAttributes = JSX.IntrinsicElements['svg'];

export interface ChevronDown24Props extends SvgAttributes {
  /**
   * Icon size. This value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: SvgAttributes['width'];
}

export function ChevronDown24(props: ChevronDown24Props) {
  const merged = mergeProps({ size: 24 }, props);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><path fill="#222" fill-rule="evenodd" d="M3.676 7.841a1.165 1.165 0 0 1 1.648 0L12 14.517l6.676-6.676a1.165 1.165 0 1 1 1.648 1.648l-7.5 7.5a1.165 1.165 0 0 1-1.648 0l-7.5-7.5a1.165 1.165 0 0 1 0-1.648" clip-rule="evenodd"/></svg>
  );
}
