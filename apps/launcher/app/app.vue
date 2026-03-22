<script setup lang="ts">

const state = ref<StatusPageState>({ kind: 'loading', step: 'getting-data' });
// const state = ref<StatusPageState>({ kind: 'error' });
</script>

<template>
  <StatusPage :state="state"/>
  <ClientOnly>
    <AppInitializer>
      <NuxtPage/>
    </AppInitializer>
  </ClientOnly>
</template>
