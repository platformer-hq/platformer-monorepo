<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core';

import { ListAndroidItemLeftIconElement, ListIosItemLeftIconElement } from '#components';

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
    :is="platform.isMappedIos ? ListAndroidItemLeftIconElement : ListIosItemLeftIconElement"
    v-bind="platform.isMappedIos ? $props : reactiveOmit($props, 'padLeft')"
  >
    <slot/>
  </component>
</template>
