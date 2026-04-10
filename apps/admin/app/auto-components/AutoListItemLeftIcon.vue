<script setup lang="ts">
import { ListAndroidItemLeftIcon, ListIosItemLeftIcon } from '@workspace/ui-kit';
import { reactiveOmit } from '@vueuse/core';

defineProps<{
  /**
   * True if the left small padding should be added in iOS.
   */
  padLeft?: boolean;
}>();

const platform = useTmaPlatform();
</script>

<template>
  <component
    :is="platform.isMappedIos ? ListIosItemLeftIcon : ListAndroidItemLeftIcon"
    v-bind="platform.isMappedIos ? $props : reactiveOmit($props, 'padLeft')"
  >
    <slot/>
  </component>
</template>
