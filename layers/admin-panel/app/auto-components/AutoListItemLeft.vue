<script setup lang="ts">
import { ListIosItemLeft, ListAndroidItemLeft } from '#components';

const props = defineProps<{
  width?: 'default' | 'large' | 'auto' | number | string;
}>();

const platform = useTmaPlatform();
const computedWidth = computed(() => (
  platform.value.isMappedAndroid
    ? props.width
    : props.width === 'large'
      ? 'default'
      : props.width
));
</script>

<template>
  <component
    :is="platform.isMappedIos ? ListIosItemLeft : ListAndroidItemLeft"
    v-bind="$props"
    :width="computedWidth"
  >
    <slot/>
  </component>
</template>
