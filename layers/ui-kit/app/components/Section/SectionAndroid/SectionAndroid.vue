<script setup lang="ts">
defineSlots<{
  header(): unknown;
  default(): unknown;
  footer(): unknown;
}>();
</script>

<template>
  <section class="section-android">
    <div class="section-android__list">
      <slot name="header"/>
      <slot/>
    </div>
    <slot name="footer"/>
  </section>
</template>

<style lang="scss">
.section-android {
  &__list {
    border-radius: 16px;
    overflow: hidden;
    background: var(--section-android-list-bg);
    transition: 300ms ease-out;
  }
}
</style>
