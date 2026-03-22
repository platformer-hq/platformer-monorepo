<script lang="ts" setup>
</script>

<template>
  <Transition
    :css="false"
    v-bind="createReversibleTransition({
      animatedProperties: { opacity: [0, 1] },
      animationOptions: { easing: 'ease-out', duration: 300 },
    })"
  >
    <slot/>
  </Transition>
</template>
