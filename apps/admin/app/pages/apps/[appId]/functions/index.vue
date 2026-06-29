<script setup lang="ts">
definePageMeta({
  name: 'app-functions',
  validate: validateParamsAppId,
});

const appId = useParamsAppId();
</script>

<template>
  <AppFunctionsPage :app-id/>
</template>
