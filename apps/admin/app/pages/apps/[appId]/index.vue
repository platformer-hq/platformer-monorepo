<script setup lang="ts">
definePageMeta({
  name: 'app',
  validate: validateParamsAppId,
});

const appId = useParamsAppId();
</script>

<template>
  <AppPage :app-id/>
</template>
