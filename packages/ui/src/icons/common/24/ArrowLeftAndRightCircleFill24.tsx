/* eslint-disable */
import { mergeProps, type JSX } from 'solid-js';

type SvgAttributes = JSX.IntrinsicElements['svg'];

export interface ArrowLeftAndRightCircleFill24Props extends SvgAttributes {
  /**
   * Icon size. This value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: SvgAttributes['width'];
}

export function ArrowLeftAndRightCircleFill24(props: ArrowLeftAndRightCircleFill24Props) {
  const merged = mergeProps({ size: 24 }, props);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M21.5 12a9.5 9.5 0 1 1-19 0 9.5 9.5 0 0 1 19 0M10.57 6.808a.625.625 0 0 1 0 .884L9.48 8.784h6.264a.625.625 0 0 1 0 1.25H9.479l1.092 1.092a.625.625 0 0 1-.884.884l-2.16-2.159a.625.625 0 0 1 0-.884l2.16-2.159a.625.625 0 0 1 .884 0m3 6.066a.625.625 0 0 1 .884-.884l2.16 2.159a.625.625 0 0 1 0 .884l-2.16 2.159a.625.625 0 1 1-.884-.884l1.092-1.092H8.4a.625.625 0 1 1 0-1.25h6.264z" clip-rule="evenodd"/></svg>
  );
}
