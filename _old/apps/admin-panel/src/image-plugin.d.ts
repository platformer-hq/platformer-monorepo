type Maybe<T> = T | null | undefined;

declare module '*.png?process' {
  interface ImageVariant {
    src: string;
    srcset: string;
  }

  export default {} as {
    blurDataUrl: string;
    height: number;
    webp: ImageVariant;
    png: ImageVariant;
    width: number;
  };
}
