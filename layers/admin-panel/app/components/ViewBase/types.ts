import type { ComputedRef, WritableComputedRef } from 'vue';

export interface ViewBaseExpose {
  scrollTop: WritableComputedRef<number>;
  rootElement: ComputedRef<HTMLElement | null | undefined>;
}
