import type { UsePageTransitionOptions } from '@/page-transitions/composables/usePageTransition';
import { createReversibleTransition } from '@/transitions/utils/transitions.js';
import { bem } from '@/utils/bem';

import './ios-page-transition.scss';

export function getIosPageTransitionOptions(): Required<Pick<
  UsePageTransitionOptions,
  'afterEnter' | 'animate' | 'beforeAnimate'
>> {
  const { b } = bem('ios-page-transition');
  const animationOptions = { duration: 300, easing: 'ease-out' };
  const leftTransition = createReversibleTransition({
    animatedProperties: { transform: ['translateX(-100px)', 'translateX(0)'] },
    animationOptions,
  });
  const rightTransition = createReversibleTransition({
    animatedProperties: { transform: ['translateX(100%)', 'translateX(0)'] },
    animationOptions,
  });

  return {
    beforeAnimate({ el, page, transition }) {
      el.classList.add(...b(page, transition).split(' '));
    },
    animate({ transition, page, el, done }) {
      (page === 'left' ? leftTransition : rightTransition)[
        transition === 'enter' ? 'onEnter' : 'onLeave'
      ](el, done);
    },
    afterEnter({ el, page }) {
      el.classList.remove(...b(page, 'enter').split(' '));
    },
  };
}
