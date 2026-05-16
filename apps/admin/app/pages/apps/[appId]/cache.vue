<script setup lang="ts">
definePageMeta({
  name: 'app-cache',
  validate: validateParamsAppId,
});

const appId = useParamsAppId();
</script>

<template>
  <AppCachePage :app-id/>
</template>
