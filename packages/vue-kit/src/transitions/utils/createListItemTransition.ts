import { createReversibleTransition, reverseTransitionKeyframesIfLeave } from './transitions';

export function createListItemTransition() {
  return createReversibleTransition({
    animatedProperties({ transition, el }) {
      return reverseTransitionKeyframesIfLeave({
        overflow: ['hidden', 'hidden'],
        height: ['0px', el.clientHeight + 'px'],
        opacity: [0, 1],
      }, transition);
    },
    animationOptions: {
      duration: 300,
      easing: 'ease-out',
    },
  });
}
