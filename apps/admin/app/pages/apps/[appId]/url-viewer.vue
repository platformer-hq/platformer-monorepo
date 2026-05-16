<script setup lang="ts">
definePageMeta({
  name: 'app-url-viewer',
  validate: validateParamsAppId,
});

const appId = useParamsAppId();
</script>

<template>
  <AppUrlViewerPage :app-id/>
</template>
