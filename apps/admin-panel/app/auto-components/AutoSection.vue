<script setup lang="ts">
import type { ColorReferenceAnyColor } from '~/domains/colors/utils/utils';

import { SectionAndroid, SectionIos } from '#components';

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
      '--section-android-list-bg': bgColor,
      '--section-ios-list-bg': bgColor,
    }"
  >
    <template v-for="id in slotIds" :key="id" #[id]>
      <slot :name="id"/>
    </template>
  </component>
</template>
