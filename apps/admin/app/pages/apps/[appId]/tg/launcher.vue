<script setup lang="ts">
definePageMeta({
  name: 'app-tg-launcher',
  validate: validateParamsAppId,
});

const appId = useParamsAppId();
</script>

<template>
  <AppTgLauncherPage :app-id/>
</template>
