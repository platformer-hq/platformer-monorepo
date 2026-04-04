import type { UsePageTransitionOptions } from '@/page-transitions/composables/usePageTransition.js';
import { createReversibleTransition } from '@/transitions/utils/transitions.js';
import { bem } from '@/utils/bem.js';

import './android-page-transition.scss';

export function getAndroidPageTransitionOptions(): Required<Pick<
  UsePageTransitionOptions,
  'afterEnter' | 'animate' | 'beforeAnimate'
>> {
  const { b } = bem('android-page-transition');
  const duration = 200;
  const tr = createReversibleTransition({
    animatedProperties: {
      transform: ['translateX(10%)', 'translateX(0)'],
      opacity: [0, 1],
    },
    animationOptions: { duration, easing: 'ease-out' },
  });

  return {
    beforeAnimate({ el, page, transition }) {
      el.classList.add(...b(page, transition).split(' '));
    },
    animate({ transition, page, el, done }) {
      if (page === 'left') {
        return setTimeout(done, duration - 5);
      }
      tr[transition === 'enter' ? 'onEnter' : 'onLeave'](el, done);
    },
    afterEnter({ el, page }) {
      el.classList.remove(...b(page, 'enter').split(' '));
    },
  };
}
