<script setup lang="ts">
const platform = useTmaPlatform();
</script>

<template>
  <slot v-if="platform.isMappedIos"/>
</template>
