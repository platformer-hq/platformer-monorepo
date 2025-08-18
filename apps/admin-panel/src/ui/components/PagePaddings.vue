<script setup lang="ts">
import { injectPlatform } from '@/providers/platform';
import { bem } from 'vue-ui';

const [b] = bem('page-paddings');
const platform = injectPlatform();

</script>

<template>
  <div :class="b(platform)">
    <slot />
  </div>
</template>

<style lang="scss">
.page-paddings {
  &--android {
    padding: 16px 0;
  }

  &--ios {
    padding: 16px;
  }
}
</style>
