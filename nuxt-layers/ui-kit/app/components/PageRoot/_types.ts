import type { ShallowRef, WritableComputedRef } from 'vue';

export interface PageRootExpose {
  scrollTop: WritableComputedRef<number>;
  rootElement: Readonly<ShallowRef<HTMLDivElement | null>>;
}
