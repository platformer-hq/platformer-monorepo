<script setup lang="ts">
import { LoadingIndicatorAndroid, LoadingIndicatorIos } from 'vue-ui';

import { injectPlatform } from '@/providers/platform';

const platform = injectPlatform();
</script>

<template>
  <div class="page-loading">
    <LoadingIndicatorAndroid
      v-if="platform === 'android'"
      :size="24"
    />
    <LoadingIndicatorIos
      v-else
      :size="24"
    />
  </div>
</template>

<style lang="scss">
.page-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
</style>
