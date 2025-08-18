<script setup lang="ts">
import SwitchIos, {
  type SwitchIosEmits,
  type SwitchIosProps,
} from '@/vue-ui/components/Switch/SwitchIos.vue';

defineProps<SwitchIosProps>();
defineEmits<SwitchIosEmits>();
</script>

<template>
  <SwitchIos
    v-bind="$props"
    class="tgui-list-ios-item-body-right-switch"
  />
</template>

<style lang="scss">
.tgui-list-ios-item-body-right-switch {
  --tgui-switch-ios-checked-bg: var(--tgui-list-ios-item-body-right-switch-checked-bg);
}
</style>
