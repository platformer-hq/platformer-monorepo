<script setup lang="ts">
</script>

<template>
  <Transition v-bind="createListIosItemTransition()" :css="false">
    <slot/>
  </Transition>
</template>
