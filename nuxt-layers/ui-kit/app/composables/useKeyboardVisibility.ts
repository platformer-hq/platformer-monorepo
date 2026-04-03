import { useEventListener } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useKeyboardVisibility = defineStore('keyboard-visibility', () => {
  const focused = ref<Set<EventTarget>>(new Set());
  const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  if (isTouchDevice) {
    useEventListener(window, 'focusin', e => {
      if (e.target && (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName))) {
        focused.value.add(e.target);
      }
    });

    useEventListener(window, 'focusout', e => {
      // We are delaying the focused signal mutation to prevent isShown "flashing" with
      // true and false.
      setTimeout(() => {
        if (e.target) {
          focused.value.delete(e.target);
        }
      }, 0);
    });
  }

  return {
    isShown: computed(() => focused.value.size > 0),
  };
});
