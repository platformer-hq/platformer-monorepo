declare module '*.png?process' {
  interface ImageVariant {
    src: string;
    srcSet: string;
  }

  export default {} as {
    blurDataURL: string;
    height: number;
    webp: ImageVariant;
    png: ImageVariant;
    width: number;
  };
}