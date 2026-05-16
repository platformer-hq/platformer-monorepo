<script setup lang="ts">
defineProps<{ show?: boolean }>();

const transition = createReversibleTransition({
  animatedProperties({ el, transition }) {
    return reverseTransitionKeyframesIfLeave({
      opacity: [0, 0, 1],
      marginTop: ['0px', '16px'],
      height: ['0px', el.clientHeight + 'px'],
      transform: ['scale(0.98)', 'scale(1)'],
    }, transition);
  },
  animationOptions: { duration: 300, easing: 'ease-out' },
});
</script>

<template>
  <Transition v-bind="transition" :css="false">
    <div v-if="show" style="margin-top: 16px">
      <UrlHttpWarning/>
    </div>
  </Transition>
</template>
