<script setup lang="ts">
import { usePlatform } from '~ui-kit/_composables/usePlatform.js';

import SwitchAndroid from './Switch/SwitchAndroid.vue';
import SwitchIos from './Switch/SwitchIos.vue';

defineProps<{
  disabled?: boolean;
}>();

const checked = defineModel<boolean>('checked', { default: false });

const platform = usePlatform();
</script>

<template>
  <component
    :is="platform === 'android' ? SwitchAndroid : SwitchIos"
    v-bind="$props"
    v-model:checked="checked"
  />
</template>
