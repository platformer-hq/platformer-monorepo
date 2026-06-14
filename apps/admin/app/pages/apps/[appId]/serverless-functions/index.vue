<script setup lang="ts">
definePageMeta({
  name: 'app-serverless-functions',
  validate: validateParamsAppId,
});

const appId = useParamsAppId();
</script>

<template>
  <AppServerlessFunctionsPage :app-id/>
</template>
