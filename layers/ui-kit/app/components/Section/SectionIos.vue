<script setup lang="ts">
defineSlots<{
  header(): unknown;
  default(): unknown;
  footer(): unknown;
}>();
</script>

<template>
  <section class="section-ios">
    <slot name="header"/>
    <div class="section-ios__list">
      <slot/>
    </div>
    <slot name="footer"/>
  </section>
</template>

<style lang="scss">
.section-ios {
  &__list {
    border-radius: 26px;
    overflow: hidden;
    background: var(--section-ios-list-bg);
  }
}
</style>
