<script setup lang="ts">
definePageMeta({
  name: 'app-test-group',
  validate: validateParamsAppId,
});

const appId = useParamsAppId();
</script>

<template>
  <AppTestGroupPage :app-id/>
</template>
