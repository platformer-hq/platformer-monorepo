<script setup lang="ts">
import TextAndroid from '@/vue-ui/components/Text/TextAndroid.vue';
</script>

<template>
  <TextAndroid
    is="p"
    variant="body1"
    class="tgui-list-android-item-left-label"
  >
    <slot />
  </TextAndroid>
</template>

<style>
.tgui-list-android-item-left-label {
  padding-right: 16px;
  color: var(--tgui-list-android-item-left-label-color, black);
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
