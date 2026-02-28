<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core';

import type { ColorReferenceAnyColor } from '~/domains/colors/utils/utils';

const { rounded = true, ...props } = defineProps<{
  rounded?: boolean;
  bgColor?: ColorReferenceAnyColor;
}>();

const platform = useTmaPlatform();
const bgColor = computed(() => colorReference(props.bgColor) || undefined);
</script>

<template>
  <ListIos v-if="platform.isMappedIos" v-bind="$props" :rounded :bg-color="bgColor">
    <slot/>
  </ListIos>
  <ListAndroid v-else v-bind="reactiveOmit($props, 'rounded')" :bg-color="bgColor">
    <slot/>
  </ListAndroid>
</template>
