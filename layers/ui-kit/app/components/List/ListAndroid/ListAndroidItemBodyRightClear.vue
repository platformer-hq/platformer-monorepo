<script setup lang="ts">
</script>

<template>
  <i class="list-android-item-body-right-clear">
    <IconXmark24 :size="20"/>
  </i>
</template>

<style lang="scss">
@use "@ui-kit/scss/mixins" as mixins;

.list-android-item-body-right-clear {
  display: flex;
  padding: 4px;
  margin-right: -4px;
  color: var(--list-android-item-body-right-clear-color);
  @include mixins.clickable;
}
</style>
