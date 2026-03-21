<script setup lang="ts">
import { ListIosItemLeft, ListAndroidItemLeft } from '#components';

const props = defineProps<{
  width?: number | string;
  size?: 'small' | 'default' | 'large';
}>();

const platform = useTmaPlatform();
</script>

<template>
  <component
    :is="platform.isMappedIos ? ListIosItemLeft : ListAndroidItemLeft"
    v-bind="$props"
    :size="platform.isMappedIos && props.size === 'large' ? 'default' : props.size"
  >
    <slot/>
  </component>
</template>
