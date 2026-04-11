<script setup lang="ts">
import ButtonAndroid from '@/components/Button/ButtonAndroid.vue';
import { IconXmark24 } from '@/icons';
</script>

<template>
  <ButtonAndroid class="tgui-list-android-item-body-right-clear">
    <IconXmark24 :size="20"/>
  </ButtonAndroid>
</template>

<style>
.tgui-list-android-item-body-right-clear {
  display: flex;
  padding: 8px;
  margin-right: -8px;
  min-height: 0;
  color: var(--tgui-list-android-item-body-right-clear-color);
}
</style>
