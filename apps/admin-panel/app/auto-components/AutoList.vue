<script setup lang="ts">
import type { ColorReferenceAnyColor } from '~/domains/colors/utils/utils';

const props = defineProps<{
  bgColor?: ColorReferenceAnyColor;
}>();

const platform = useTmaPlatform();
const bgColor = computed(() => colorReference(props.bgColor) || undefined);
</script>

<template>
  <ListIos v-if="platform.isMappedIos" v-bind="$props" :bg-color="bgColor">
    <slot/>
  </ListIos>
  <ListAndroid v-else v-bind="$props" :bg-color="bgColor">
    <slot/>
  </ListAndroid>
</template>
