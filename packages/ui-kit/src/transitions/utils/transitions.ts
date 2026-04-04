export function reverseTransitionKeyframes(keyframes: PropertyIndexedKeyframes) {
  const properties = { ...keyframes };
  for (const key in properties) {
    if (Array.isArray(properties[key])) {
      properties[key] = properties[key].slice().reverse();
    }
  }
  return properties;
}

export function reverseTransitionKeyframesIfLeave(
  keyframes: PropertyIndexedKeyframes,
  transition: 'enter' | 'leave',
) {
  return transition === 'enter'
    ? keyframes
    : reverseTransitionKeyframes(keyframes);
}

export function createReversibleTransition({
  animatedProperties,
  animationOptions,
  onAfterLeave = () => undefined,
  onBeforeLeave = () => undefined,
}: {
  animatedProperties:
    | PropertyIndexedKeyframes
    | ((context: {
      transition: 'leave' | 'enter';
      el: Element;
    }) => PropertyIndexedKeyframes);
  animationOptions?:
    | KeyframeAnimationOptions
    | ((context: {
      transition: 'leave' | 'enter';
    }) => KeyframeAnimationOptions);
  onBeforeLeave?(el: Element): void | Promise<void>;
  onAfterLeave?(el: Element): void | Promise<void>;
}) {
  const createTransition = (kind: 'enter' | 'leave') => {
    return (el: Element, done: VoidFunction) => {
      let properties: PropertyIndexedKeyframes;
      if (typeof animatedProperties === 'function') {
        properties = animatedProperties({ el, transition: kind });
      } else {
        properties = reverseTransitionKeyframesIfLeave(animatedProperties, kind);
      }
      if (kind === 'leave') {
        onBeforeLeave(el);
      }
      el
        .animate(
          properties,
          typeof animationOptions === 'function'
            ? animationOptions({ transition: kind })
            : animationOptions,
        )
        .finished
        .then(() => {
          onAfterLeave(el);
          done();
        });
    };
  };
  return {
    onEnter: createTransition('enter'),
    onLeave: createTransition('leave'),
  };
}
