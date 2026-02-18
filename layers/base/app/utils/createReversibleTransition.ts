export function createReversibleTransition({
  animatedProperties,
  animationOptions,
  onAfterLeave = () => undefined,
  onBeforeLeave = () => undefined,
}: {
  animatedProperties: PropertyIndexedKeyframes | ((el: Element) => PropertyIndexedKeyframes);
  animationOptions?: KeyframeAnimationOptions;
  onBeforeLeave?(el: Element): void | Promise<void>;
  onAfterLeave?(el: Element): void | Promise<void>;
}) {
  const createTransition = (kind: 'enter' | 'leave') => {
    return (el: Element, done: VoidFunction) => {
      const properties = typeof animatedProperties === 'function'
        ? animatedProperties(el)
        : { ...animatedProperties };
      if (kind === 'leave') {
        for (const key in properties) {
          if (Array.isArray(properties[key])) {
            properties[key] = properties[key].slice().reverse();
          }
        }
        onBeforeLeave(el);
      }
      el
        .animate(properties, animationOptions)
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
