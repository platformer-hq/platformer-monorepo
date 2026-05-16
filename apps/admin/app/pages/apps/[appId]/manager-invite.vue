<script setup lang="ts">
definePageMeta({
  name: 'app-manager-invite',
  validate: validateParamsAppId,
});

const appId = useParamsAppId();
</script>

<template>
  <AppManagerInvitePage :app-id/>
</template>
