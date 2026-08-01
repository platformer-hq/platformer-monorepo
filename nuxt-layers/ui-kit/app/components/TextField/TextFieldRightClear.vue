<script lang="ts" setup>
import { IconXmark24 } from '@workspace/icons';

import { usePlatform } from '~ui-kit/_composables/usePlatform';

const platform = usePlatform();

const { b, e } = bem('text-field-right-clear');
</script>

<template>
  <div :class="b(platform)">
    <IconXmark24 :class="e('icon')" :size="24"/>
  </div>
</template>

<style lang="scss">
.text-field-right-clear {
  box-sizing: content-box;
  color: var(--subtitle-text-color);
  @include mixins.clickable;

  &--ios {
    padding: 5px;
    margin-right: -7px;
  }

  &--android {
    padding: 8px;
    margin-right: -6px;
  }

  &__icon {
    display: block;
  }
}
</style>
