<script setup lang="ts">
import { IconChevronRight16 } from '@workspace/icons';

import { usePlatform } from '~ui-kit/_composables/usePlatform';

const platform = usePlatform();

const { b } = bem('list-item-body-right-chevron');
</script>

<template>
  <IconChevronRight16 :class="b(platform)" v-bind="$props"/>
</template>

<style lang="scss">
.list-item-body-right-chevron {
  color: var(--subtitle-text-color);

  &--android {
    width: 20px;
    margin-right: -6.5px;
  }

  &--ios {
    margin: 0 -5px;
  }
}
</style>
