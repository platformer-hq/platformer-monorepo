import { useEventListener } from '@vueuse/core';
import { computed, ref, type ComputedRef } from 'vue';

export function useActiveStateHandler(): [
  active: ComputedRef<boolean>,
  onPointerDown: () => void,
] {
  const active = ref(false);
  const resetActive = () => {
    active.value = false;
  };

  useEventListener(document, ['pointercancel', 'pointerup'], resetActive);

  return [computed(() => active.value), () => {
    active.value = true;
  }];
}
