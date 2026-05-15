import { createReversibleTransition, reverseTransitionKeyframesIfLeave } from '@/utils/transitions';

export function createListIosItemTransition() {
  return createReversibleTransition({
    animatedProperties({ transition, el }) {
      return reverseTransitionKeyframesIfLeave({
        marginBottom: [`-${el.clientHeight}px`, '0px'],
        opacity: [0, 1],
      }, transition);
    },
    animationOptions: { duration: 300, easing: 'ease-out' },
  });
}
