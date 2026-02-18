<script setup lang="ts">
import RadioIos, {
  type RadioIosEmits,
  type RadioIosProps,
} from '@/vue-ui/components/Radio/RadioIos.vue';

defineProps<RadioIosProps>();
defineEmits<RadioIosEmits>();
</script>

<template>
  <RadioIos
    v-bind="$props"
    class="root"
  />
</template>

<style scoped lang="scss">
.root {
  @each $part in ("border-color", "checked-color", "icon-color") {
    --tgui-radio-ios-#{$part}: var(--tgui-list-ios-item-body-right-radio-#{$part});
  }
}
</style>
