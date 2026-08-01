<script setup lang="ts">
import { IconXmark24, IconXmarkFill28 } from '@workspace/icons';

import { usePlatform } from '~/_composables/usePlatform';

const platform = usePlatform();

const { b } = bem('list-item-body-right-clear');
</script>

<template>
  <VButton v-if="platform === 'android'" :class="b('android')">
    <IconXmark24 :size="20"/>
  </VButton>
  <i :class="b('ios')">
    <IconXmarkFill28 :size="20"/>
  </i>
</template>

<style lang="scss">
.list-item-body-right-clear {
  display: flex;
  color: var(--subtitle-text-color);
  @include mixins.clickable;

  &--android {
    padding: 8px;
    margin-right: -8px;
    min-height: 0;
  }

  &--ios {
    padding: 4px;
    margin-right: -4px;
  }
}
</style>
