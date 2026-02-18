<script setup lang="ts">
import { bem } from 'vue-ui';

import { injectListItemOptions } from './provider';

defineSlots<{
  input(): any;
  left(): any;
  right(): any;
}>();

const [b] = bem('tgui-list-ios-item-body');
const { first } = injectListItemOptions();
</script>

<template>
  <div :class="b({ first })">
    <slot
      v-if="$slots.input"
      name="input"
    />
    <template v-else>
      <slot name="left" />
      <slot name="right" />
    </template>
  </div>
</template>

<style lang="scss">
.tgui-list-ios-item-body {
  display: flex;
  flex: 1 0 0;
  align-items: center;
  box-sizing: border-box;
  box-shadow: 0 0.33px 0 var(--tgui-list-ios-divider-color, #C8C7CC) inset;
  max-width: 100%;
  overflow: hidden;
  padding-right: 16px;

  &--first {
    box-shadow: none;
  }
}

</style>
