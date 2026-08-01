<script setup lang="ts">
import { IconCheckmarkIOS28, IconCheckmarkAndroid28 } from '@workspace/icons';

import { usePlatform } from '~ui-kit/_composables/usePlatform';

const platform = usePlatform();
</script>

<template>
  <component
    :is="platform === 'android' ? IconCheckmarkAndroid28 : IconCheckmarkIOS28"
    class="list-item-body-right-checkmark"
  />
</template>

<style>
.list-item-body-right-checkmark {
  margin: 0 -6px;
  color: var(--accent-text-color);
}
</style>
