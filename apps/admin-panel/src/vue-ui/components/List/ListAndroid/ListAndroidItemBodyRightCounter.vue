<script setup lang="ts">
import TextAndroid from '@/vue-ui/components/Text/TextAndroid.vue';
</script>

<template>
  <TextAndroid
    is="p"
    class="tgui-list-android-item-body-right-counter"
    variant="subtitle2"
    weight="medium"
  >
    <slot />
  </TextAndroid>
</template>

<style>
.tgui-list-android-item-body-right-counter {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1000px;
  color: var(--tgui-list-android-item-body-right-counter-text-color, white);
  background: var(--tgui-list-android-item-body-right-counter-bg, #CC2929);
  min-width: 24px;
  height: 24px;
  box-sizing: border-box;
  padding: 0 7px;
}
</style>
