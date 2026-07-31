import type { RGB } from '@tma.js/sdk-vue';

type HSL = readonly [h: number, r: number, b: number];

function toHsl(value: RGB | HSL): HSL {
  return typeof value === 'string' ? rgbToHsl(value) : value;
}

export function applyColorDiff(
  diffA: RGB | HSL,
  diffB: RGB | HSL,
  target: RGB | HSL,
): RGB {
  const [h1, s1, l1] = toHsl(diffA);
  const [h2, s2, l2] = toHsl(diffB);
  const [h3, s3, l3] = toHsl(target);
  return hslToRgb(
    h3 + (h2 - h1),
    Math.min(100, Math.max(0, s3 + (s2 - s1))),
    Math.min(100, Math.max(0, l3 + (l2 - l1))),
  );
}
