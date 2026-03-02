import { useMousePressed, type MaybeComputedElementRef } from '@vueuse/core';

export function useRipples(options: {
  /**
   * @default true
   */
  enabled?: ComputedRef<boolean>;
  containerRef: MaybeComputedElementRef<HTMLElement | null | undefined>;
  clickRef: MaybeComputedElementRef<HTMLElement | null | undefined>;
}) {
  let lastAddedRippleKey: number | undefined;
  const { pressed } = useMousePressed({
    target: options.clickRef,
    async onPressed(event) {
      const container = toValue(options.containerRef);
      const enabled = options.enabled?.value ?? true;
      if (!enabled || !container) {
        return;
      }
      const [x, y] = 'clientX' in event
        ? [event.clientX, event.clientY]
        : [event.touches[0]!.clientX, event.touches[0]!.clientY];
      const { currentTarget } = event;
      const rect = (currentTarget as HTMLElement).getBoundingClientRect();
      const ripple = {
        x: x - rect.left,
        y: y - rect.top,
        key: Math.random(),
      };
      lastAddedRippleKey = ripple.key;

      // Create ripple element and add to container.
      const rippleEl = document.createElement('span');
      rippleEl.style.aspectRatio = '1';
      rippleEl.style.display = 'block';
      rippleEl.style.background = 'currentcolor';
      rippleEl.style.borderRadius = '50%';
      rippleEl.style.transform = 'translate(-50%, -50%)';
      rippleEl.style.position = 'absolute';
      rippleEl.style.left = `${ripple.x}px`;
      rippleEl.style.top = `${ripple.y}px`;
      container.appendChild(rippleEl);

      // Animate the ripple appearance.
      await rippleEl
        .animate(
          { width: ['0', '220%'], opacity: [0, 0.1, 0.1] },
          { duration: 300, easing: 'ease', fill: 'both' },
        )
        .finished;

      const removeRipple = () => {
        return rippleEl.animate({ opacity: [0.1, 0] }, { duration: 200 }).finished.then(() => {
          container.removeChild(rippleEl);
        });
      };

      // If the user is holding the pointer and the last one added ripple is the current
      // one, we should wait for the user to move the pointer away and then remove the ripple.
      if (pressed.value && lastAddedRippleKey === ripple.key) {
        const stop = watch(pressed, v => {
          if (!v) {
            stop();
            removeRipple();
          }
        });
        return;
      }
      // In all other cases the ripple can be safely removed.
      await removeRipple();
    },
    drag: false,
    // We disable touch as long as it causes double onPressed function calls.
    // In turn, this creates 2 ripples instead of 1.
    touch: false,
  });
}
