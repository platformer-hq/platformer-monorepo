<script setup lang="ts">
import RoundedPanelIos from '@/components/RoundedPanel/RoundedPanelIos.vue';

defineSlots<{
  header(): unknown;
  default(): unknown;
  footer(): unknown;
}>();
</script>

<template>
  <section class="tgui-section-ios">
    <slot name="header"/>
    <RoundedPanelIos class="tgui-section-ios__list">
      <slot/>
    </RoundedPanelIos>
    <slot name="footer"/>
  </section>
</template>

<style>
.tgui-section-ios__list {
  overflow: hidden;
  background: var(--tgui-section-ios-list-bg);
}
</style>
