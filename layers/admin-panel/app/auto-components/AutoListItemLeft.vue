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
    :size="platform.isMappedAndroid || props.size !== 'large' ? props.size : 'default'"
  >
    <slot/>
  </component>
</template>
