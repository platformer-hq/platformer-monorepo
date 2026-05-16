<script setup lang="ts">
defineProps<{ show?: boolean }>();
</script>

<template>
  <Transition
    v-bind="createReversibleTransition({
      animatedProperties: { opacity: [0, 1], transform: ['scale(0.98)', 'scale(1)'] },
      animationOptions: { duration: 300, easing: 'ease-out' },
    })"
    :css="false"
  >
    <UrlHttpWarning v-if="show" style="margin-top: 16px"/>
  </Transition>
</template>
