import type { TransitionProps } from 'vue';

type TransitionPhase = 'leave' | 'enter';

/**
 * Reverses keyframes if transition is "leave".
 * @param keyframes
 * @param transition
 * @returns
 */
export function reverseTransitionKeyframesIfLeave(
  keyframes: PropertyIndexedKeyframes,
  transition: TransitionPhase,
) {
  if (transition === 'enter') {
    return keyframes;
  }
  const properties = { ...keyframes };
  for (const key in properties) {
    if (Array.isArray(properties[key])) {
      properties[key] = properties[key].slice().reverse();
    }
  }
  return properties;
}

/**
 * Creates a transition that reverses keyframes if transitions phase is "leave". The keyframes
 * are used as-is when the phase is "enter".
 */
export function createReversibleTransition({ animatedProperties, animationOptions }: {
  animatedProperties:
    | PropertyIndexedKeyframes
    | ((context: { transition: TransitionPhase; el: Element }) => PropertyIndexedKeyframes);
  animationOptions?:
    | KeyframeAnimationOptions
    | ((context: { transition: TransitionPhase }) => KeyframeAnimationOptions);
}): Pick<TransitionProps, 'onEnter' | 'onLeave'> {
  const createTransition = (phase: TransitionPhase) => {
    return (el: Element, done: VoidFunction) => {
      el
        .animate(
          typeof animatedProperties === 'function'
            ? animatedProperties({ el, transition: phase })
            : reverseTransitionKeyframesIfLeave(animatedProperties, phase),
          typeof animationOptions === 'function'
            ? animationOptions({ transition: phase })
            : animationOptions,
        )
        .finished
        .then(() => {
          done();
        });
    };
  };
  return {
    onEnter: createTransition('enter'),
    onLeave: createTransition('leave'),
  };
}
