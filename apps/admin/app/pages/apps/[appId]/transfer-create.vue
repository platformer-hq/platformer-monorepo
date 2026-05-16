<script setup lang="ts">
definePageMeta({
  name: 'app-transfer-create',
  validate: validateParamsAppId,
});

const appId = useParamsAppId();
</script>

<template>
  <AppTransferCreatePage :app-id/>
</template>
