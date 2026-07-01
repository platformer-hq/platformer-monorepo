<script setup lang="ts">
defineSlots<{
  header(): unknown;
  default(): unknown;
  footer(): unknown;
}>();
</script>

<template>
  <section class="tgui-section-android">
    <RoundedPanelAndroid class="tgui-section-android__list">
      <slot name="header"/>
      <slot/>
    </RoundedPanelAndroid>
    <slot name="footer"/>
  </section>
</template>

<style>
.tgui-section-android__list {
  overflow: hidden;
  background: var(--tgui-section-android-list-bg);
}
</style>
