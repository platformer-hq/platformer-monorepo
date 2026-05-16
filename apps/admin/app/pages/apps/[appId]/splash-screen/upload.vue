<script setup lang="ts">
definePageMeta({
  name: 'app-splash-screen-upload',
  validate: validateParamsAppId,
});

const appId = useParamsAppId();
</script>

<template>
  <AppSplashScreenUploadPage :app-id/>
</template>
