<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
router.replace('/apps').catch(e => {
  console.error('failed to redirect to apps', e);
});
</script>

<template>
  <span />
</template>
