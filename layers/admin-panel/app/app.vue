<script setup lang="ts">
import { miniApp } from '@tma.js/sdk-vue';
</script>

<template>
  <ClientOnly>
    <NavigationStateProvider>
      <LayoutBody v-slot="{transition}" @ready="miniApp.ready">
        <NuxtPage :page-key="route => route.path" :transition="transition"/>
      </LayoutBody>
    </NavigationStateProvider>
  </ClientOnly>
</template>
