<script setup lang="ts">
import TextAndroid from '@/vue-ui/components/Text/TextAndroid.vue';
</script>

<template>
  <TextAndroid
    is="p"
    variant="body1"
    class="tgui-list-android-item-body-right-label"
  >
    <slot />
  </TextAndroid>
</template>

<style lang="scss">
.tgui-list-android-item-body-right-label {
  color: var(--tgui-list-android-item-body-right-label-color, #82868A);
}
</style>
