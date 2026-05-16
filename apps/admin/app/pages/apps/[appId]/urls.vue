<script setup lang="ts">
definePageMeta({
  name: 'app-urls',
  validate: validateParamsAppId,
});

const appId = useParamsAppId();
</script>

<template>
  <AppUrlsPage :app-id/>
</template>
