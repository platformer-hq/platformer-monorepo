<script setup lang="ts">
definePageMeta({
  name: 'app-managers',
  validate: validateParamsAppId,
});

const appId = useParamsAppId();
</script>

<template>
  <AppManagersPage :app-id/>
</template>
