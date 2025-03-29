/* eslint-disable */
import { mergeProps, type JSX } from 'solid-js';

type SvgAttributes = JSX.IntrinsicElements['svg'];

export interface MinusCircleFill24Props extends SvgAttributes {
  /**
   * Icon size. This value will be passed to the SVG's width and height attributes.
   * @default 24
   */
  size?: SvgAttributes['width'];
}

export function MinusCircleFill24(props: MinusCircleFill24Props) {
  const merged = mergeProps({ size: 24 }, props);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={merged.size} height={merged.size} {...props}><path fill="currentColor" fill-rule="evenodd" d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19m-4.286 8.75a.75.75 0 0 0 0 1.5h8.572a.75.75 0 0 0 0-1.5z" clip-rule="evenodd"/></svg>
  );
}
