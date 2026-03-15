<script setup lang="ts">
</script>

<template>
  <ButtonAndroid class="list-android-item-body-right-clear">
    <IconXmark24 :size="20"/>
  </ButtonAndroid>
</template>

<style lang="scss">
.list-android-item-body-right-clear {
  display: flex;
  padding: 8px;
  margin-right: -8px;
  min-height: 0;
  color: var(--list-android-item-body-right-clear-color);
}
</style>
