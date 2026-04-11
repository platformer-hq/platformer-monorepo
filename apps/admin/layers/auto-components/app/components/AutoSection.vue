<script setup lang="ts">
import { SectionAndroid, SectionIos } from '@tma.js/vue-kit';

import type { ColorReferenceAnyColor } from '#colors/utils/utils';

const props = defineProps<{
  listBgColor?: ColorReferenceAnyColor;
}>();
defineSlots<{
  header(): unknown;
  default(): unknown;
  footer(): unknown;
}>();

const platform = useTmaPlatform();
const bgColor = computed(() => colorReference(props.listBgColor) || undefined);
const slotIds = ['header', 'default', 'footer'] as const;
</script>

<template>
  <component
    :is="platform.isMappedIos ? SectionIos : SectionAndroid"
    :style="{
      '--tgui-section-android-list-bg': bgColor,
      '--tgui-section-ios-list-bg': bgColor,
    }"
  >
    <template v-for="id in slotIds" :key="id" #[id]>
      <slot :name="id"/>
    </template>
  </component>
</template>
