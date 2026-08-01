<script setup lang="ts">
import type { KnownCssColorToken } from '~colors/generated';
import { usePlatform } from '~ui-kit/_composables/usePlatform';

defineProps<{
  listBgColor?: KnownCssColorToken;
}>();
defineSlots<{
  header(): unknown;
  default(): unknown;
  footer(): unknown;
}>();

const platform = usePlatform();

const { b, e } = bem('v-section');
</script>

<template>
  <section :class="b()">
    <slot v-if="platform === 'ios'" name="header"/>
    <RoundedPanel
      :class="e('list')"
      :style="{background: listBgColor ? cssColorTokenReference(listBgColor) : undefined}"
    >
      <slot v-if="platform === 'android'" name="header"/>
      <slot/>
    </RoundedPanel>
    <slot name="footer"/>
  </section>
</template>

<style>
.v-section__list {
  overflow: hidden;
}
</style>
