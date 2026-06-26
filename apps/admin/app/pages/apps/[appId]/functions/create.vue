<script setup lang="ts">
definePageMeta({
  name: 'create-app-function',
  validate: validateParamsAppId,
});

const appId = useParamsAppId();
</script>

<template>
  <AppFunctionPage :app-id/>
</template>
