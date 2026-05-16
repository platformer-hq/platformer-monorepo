<script setup lang="ts">
definePageMeta({
  name: 'app-test-groups',
  validate: validateParamsAppId,
});

const appId = useParamsAppId();
</script>

<template>
  <AppTestGroupsPage :app-id/>
</template>
