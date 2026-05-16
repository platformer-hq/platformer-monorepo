<script setup lang="ts">
definePageMeta({
  name: 'app-transfer',
  validate: validateParamsAppId,
});

const appId = useParamsAppId();
</script>

<template>
  <AppTransferPage :app-id/>
</template>
