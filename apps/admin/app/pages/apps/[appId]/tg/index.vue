<script setup lang="ts">
definePageMeta({
  name: 'app-tg',
  validate: validateParamsAppId,
});

const appId = useParamsAppId();
</script>

<template>
  <AppTgPage :app-id/>
</template>
