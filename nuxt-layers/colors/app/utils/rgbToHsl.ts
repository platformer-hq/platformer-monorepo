import { toRGBFull, type RGB } from '@tma.js/sdk-vue';

export function rgbToHsl(rgb: RGB): [h: number, s: number, l: number] {
  let [r, g, b] = toRGBFull(rgb)
    .slice(1)
    .match(/[\da-f]{2}/g)!
    .map(v => parseInt(v, 16)) as [number, number, number, number];
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h: number;
  let s: number;
  const l = (max + min) / 2;
  if (delta === 0) {
    h = s = 0;
  } else {
    s = l > 0.5
      ? delta / (2 - max - min)
      : delta / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / delta) + (g < b ? 6 : 0);
        break;
      case g:
        h = ((b - r) / delta) + 2;
        break;
      case b:
        h = ((r - g) / delta) + 4;
        break;
    }
    h! /= 6;
  }

  // Convert to degrees and percentages
  return [
    Math.round(h! * 360),
    Math.round(s * 100),
    Math.round(l * 100),
  ];
}
