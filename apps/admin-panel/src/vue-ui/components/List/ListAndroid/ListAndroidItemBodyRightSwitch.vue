<script setup lang="ts">
import SwitchAndroid, {
  type SwitchAndroidEmits,
  type SwitchAndroidProps,
} from '@/vue-ui/components/Switch/SwitchAndroid.vue';

defineProps<SwitchAndroidProps>();
defineEmits<SwitchAndroidEmits>();
</script>

<template>
  <SwitchAndroid
    v-bind="$props"
    class="tgui-list-android-item-body-right-switch"
  />
</template>

<style lang="scss">
.tgui-list-android-item-body-right-switch {
  @each $part in ("bg", "checked-bg", "thumb-border-bg", "thumb-bg", "border-checked-bg") {
    --tgui-switch-android-#{$part}: var(--tgui-list-android-item-body-right-switch-#{$part});
  }
}
</style>
