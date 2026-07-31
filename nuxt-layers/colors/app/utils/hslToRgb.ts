import type { RGB } from '@tma.js/sdk-vue';

export function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number;
  let g: number;
  let b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    // Helper function to calculate color for each channel
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) {
        t += 1;
      }
      if (t > 1) {
        t -= 1;
      }
      if (t < 1 / 6) {
        return p + ((q - p) * 6 * t);
      }
      if (t < 1 / 2) {
        return q;
      }
      if (t < 2 / 3) {
        return p + ((q - p) * ((2 / 3) - t) * 6);
      }
      return p;
    };

    const q = l < 0.5
      ? l * (1 + s)
      : (l + s) - (l * s);
    const p = (2 * l) - q;

    r = hue2rgb(p, q, h + (1 / 3));
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - (1 / 3));
  }
  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255),
  ].reduce<string>((acc, component) => {
    return acc + component.toString(16).padStart(2, '0');
  }, '#') as RGB;
}
