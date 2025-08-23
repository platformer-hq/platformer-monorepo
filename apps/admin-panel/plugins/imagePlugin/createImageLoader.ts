import { readFileSync } from 'node:fs';
import sharp, { type Sharp } from 'sharp';

/**
 * @returns A function loading images from filesystem, rescaling and compressing them.
 */
export function createImageLoader() {
  const initials = new Map<string, [image: Sharp, meta: {
    width: number;
    height: number;
  }]>();
  const processed = new Map<string, {
    width: number;
    height: number;
    webp: Buffer;
    png: Buffer;
    blurDataURL: string;
  }>();

  return async function loadImage(options: {
    path: string;
    initialScale: number;
    scale: number;
  }) {
    const { scale, initialScale, path } = options;

    // Step 1: Retrieve a cached value.
    const cacheKey = `${path}-${initialScale}-${scale}`;
    const cached = processed.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Step 2: Retrieve the initial image.
    const initialKey = `${path}-${initialScale}`;
    let initialTuple = initials.get(initialKey);
    if (!initialTuple) {
      const initialSharp = sharp(readFileSync(path));
      const { width = 0, height = 0 } = await initialSharp.metadata();
      initialTuple = [initialSharp, { width, height }];
      initials.set(initialKey, initialTuple);
    }

    // Step 3: Compress and rescale the image.
    const [initial, initialMeta] = initialTuple;
    const width = initialMeta.width * scale / initialScale | 0;
    const height = initialMeta.height * scale / initialScale | 0;
    const resized = initial.clone().resize({ width, height });
    const result = {
      width,
      height,
      png: await resized.clone()
        .png({ compressionLevel: 6, quality: 60 })
        .toBuffer(),
      webp: await resized.webp({ quality: 60 }).toBuffer(),
      blurDataURL: `data:image/png;base64,${await initial
        .clone()
        .resize(10)
        .toBuffer()
        .then(buffer => buffer.toString('base64'))}`,
    };
    processed.set(cacheKey, result);

    return result;
  };
}
