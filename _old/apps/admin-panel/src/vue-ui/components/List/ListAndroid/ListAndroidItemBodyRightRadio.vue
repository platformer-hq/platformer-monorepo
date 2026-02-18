<script setup lang="ts">
import RadioAndroid, {
  type RadioAndroidEmits,
  type RadioAndroidProps,
} from '@/vue-ui/components/Radio/RadioAndroid.vue';

defineProps<RadioAndroidProps>();
defineEmits<RadioAndroidEmits>();
</script>

<template>
  <RadioAndroid
    v-bind="$props"
    class="root"
  />
</template>

<style scoped>
.root {
  --tgui-radio-android-color: var(--tgui-list-android-item-body-right-radio-color);
  --tgui-radio-android-checked-color: var(--tgui-list-android-item-body-right-radio-checked-color);
}
</style>
