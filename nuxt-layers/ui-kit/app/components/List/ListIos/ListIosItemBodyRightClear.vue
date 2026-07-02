<script setup lang="ts">
import { IconXmarkFill28 } from '@workspace/icons';

import type { KnownHtmlTag } from '#ui-kit/types';

withDefaults(defineProps<{
  /**
   * @default 'i'
   */
  as?: KnownHtmlTag;
}>(), {
  as: 'i',
});
</script>

<template>
  <component :is="as" class="tgui-list-ios-item-body-right-clear">
    <IconXmarkFill28 :size="20"/>
  </component>
</template>

<style lang="scss">
@use "~scss/mixins";

.tgui-list-ios-item-body-right-clear {
  display: flex;
  padding: 4px;
  margin-right: -4px;
  color: var(--tgui-list-ios-item-body-right-clear-color);
  @include mixins.clickable;
}
</style>
