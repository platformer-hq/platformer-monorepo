<script setup lang="ts">
import { reactivePick } from '@vueuse/core';

import { ListIosItemBodyLeftInputElement, ListAndroidItemBodyLeftInputElement } from '#components';

const props = withDefaults(defineProps<{
  multiline?: boolean;
  /**
   * True if the element should be scrollable into view when focused. This is sometimes required
   * for Telegram for iOS when the input is being focused and the keyboard is shown, hiding
   * the input itself.
   */
  scrollIntoViewOnFocus?: boolean;
  /**
   * True if the element should blur on click outside.
   * @default true
   */
  blurOnClickOutside?: boolean;
}>(), {
  blurOnClickOutside: true,
});

const platform = useTmaPlatform();
const shared = reactivePick(props, ['multiline', 'blurOnClickOutside']);
</script>

<template>
  <ListIosItemBodyLeftInputElement
    v-if="platform.isMappedIos"
    v-bind="{...shared, scrollIntoViewOnFocus}"
  >
    <slot/>
  </ListIosItemBodyLeftInputElement>
  <ListAndroidItemBodyLeftInputElement v-else v-bind="shared">
    <slot/>
  </ListAndroidItemBodyLeftInputElement>
</template>
