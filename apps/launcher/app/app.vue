<script setup lang="ts">

</script>

<template>
  <StatusPage status="loading" title="Loading something" subtitle="Something is loading"/>
  <ClientOnly>
    <AppInitializer>
      <NuxtPage/>
    </AppInitializer>
  </ClientOnly>
</template>
