<script setup lang="ts">
defineProps<{
  animationOptions?: KeyframeAnimationOptions;
}>();
</script>

<template>
  <Transition
    v-bind="createReversibleTransition({
      animatedProperties({ el, transition }) {
        return reverseTransitionKeyframesIfLeave({
          overflow: ['hidden', 'hidden'],
          height: ['0px', el.clientHeight + 'px'],
          paddingBottom: ['0px', 'var(--sum-inset-bottom)'],
          marginBottom: ['-24px', '0px'],
          opacity: [0, 0, 0, 1],
        }, transition);
      },
      animationOptions: animationOptions || { duration: 500, easing: 'ease-in-out' },
    })"
    :css="false"
  >
    <slot/>
  </Transition>
</template>
