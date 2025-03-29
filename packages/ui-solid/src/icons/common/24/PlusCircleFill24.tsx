/* eslint-disable */
import { mergeProps, type JSX } from 'solid-js';

type SvgAttributes = JSX.IntrinsicElements['svg'];

export interface PlusCircleFill24Props extends SvgAttributes {
  /**
   * Icon size. This value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: SvgAttributes['width'];
}

export function PlusCircleFill24(props: PlusCircleFill24Props) {
  const merged = mergeProps({ size: 24 }, props);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M2.5 12a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0M12 6.964a.75.75 0 0 1 .75.75v3.536h3.536a.75.75 0 0 1 0 1.5H12.75v3.536a.75.75 0 0 1-1.5 0V12.75H7.714a.75.75 0 0 1 0-1.5h3.536V7.714a.75.75 0 0 1 .75-.75" clip-rule="evenodd"/></svg>
  );
}
