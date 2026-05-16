<script setup lang="ts">
definePageMeta({
  name: 'app-splash-screen',
  validate: validateParamsAppId,
});

const appId = useParamsAppId();
</script>

<template>
  <AppSplashScreenPage :app-id/>
</template>
