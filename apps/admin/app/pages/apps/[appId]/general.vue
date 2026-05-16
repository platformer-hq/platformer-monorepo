<script setup lang="ts">
definePageMeta({
  name: 'app-general',
  validate: validateParamsAppId,
});

const appId = useParamsAppId();
</script>

<template>
  <AppGeneralPage :app-id/>
</template>
