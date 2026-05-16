<script setup lang="ts">
definePageMeta({
  name: 'app-tg-integration',
  validate: validateParamsAppId,
});

const appId = useParamsAppId();
</script>

<template>
  <AppTgIntegrationPage :app-id/>
</template>
