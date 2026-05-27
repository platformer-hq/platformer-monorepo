<script setup lang="ts">
import { TextFieldAndroid, TextFieldIos } from '@tma.js/vue-kit';

import type { ColorReferenceAnyColor } from '#colors/utils/utils';

const props = defineProps<{
  bgColor?: ColorReferenceAnyColor;
  textColor?: ColorReferenceAnyColor;
  rounded?: boolean;
  glass?: boolean;
}>();
defineSlots<{
  left(): unknown;
  input(): unknown;
  right(): unknown;
}>();

const platform = useTmaPlatform();
const bgColor = computed(() => colorReference(props.bgColor) || undefined);
const textColor = computed(() => colorReference(props.textColor) || undefined);
const slotIds = ['left', 'input', 'right'] as const;
</script>

<template>
  <component
    :is="platform.isMappedIos ? TextFieldIos : TextFieldAndroid"
    :style="platform.isMappedIos ? {
      '--tgui-text-field-ios-bg-color': bgColor,
      '--tgui-text-field-ios-text-color': textColor,
    } : {
      '--tgui-text-field-android-bg-color': bgColor,
      '--tgui-text-field-android-text-color': textColor,
    }"
    v-bind="platform.isMappedIos ? { glass, rounded } : undefined"
  >
    <template v-for="id in slotIds" :key="id" #[id]>
      <slot :name="id"/>
    </template>
  </component>
</template>
