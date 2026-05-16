<script setup lang="ts">
definePageMeta({
  name: 'app-manager',
  validate: validateParamsAppId,
});

const appId = useParamsAppId();
</script>

<template>
  <AppManagerPage :app-id/>
</template>
