<script setup lang="ts">
</script>

<template>
  <Transition v-bind="createListAndroidItemTransition()" :css="false">
    <slot/>
  </Transition>
</template>
