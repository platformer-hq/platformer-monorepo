<script setup lang="ts">
const platform = useTmaPlatform();
</script>

<template>
  <slot v-if="platform.isMappedAndroid"/>
</template>
