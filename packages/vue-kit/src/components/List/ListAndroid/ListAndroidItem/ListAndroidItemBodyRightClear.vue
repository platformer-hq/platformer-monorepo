<script setup lang="ts">
import ButtonAndroid from '@/components/Button/ButtonAndroid.vue';
import IconXMark24 from '@/icons/xmark-24.svg?component';
</script>

<template>
  <ButtonAndroid class="tgui-list-android-item-body-right-clear">
    <IconXMark24 :width="20" :height="20"/>
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
