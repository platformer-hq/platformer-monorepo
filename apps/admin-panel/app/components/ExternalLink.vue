<script setup lang="ts">
import { openLink, openTelegramLink } from '@tma.js/sdk-vue';

defineProps<{
  href: string;
}>();
</script>

<template>
  <a
    :href
    class="external-link"
    target="_blank"
    rel="noopener noreferrer"
    @click.prevent="href.startsWith('https://t.me') ? openTelegramLink(href) : openLink(href)"
  >
    <slot/>
  </a>
</template>

<style lang="scss">
.external-link {
  text-decoration: none;
  color: var(--link-color);
}
</style>
