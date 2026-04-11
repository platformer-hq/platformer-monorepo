<script setup lang="ts">
import { openAnyLink } from '@workspace/tma';

defineProps<{ href: string }>();
</script>

<template>
  <a
    :href
    class="external-link"
    target="_blank"
    rel="noopener noreferrer"
    @click.prevent="openAnyLink(href)"
  >
    <slot/>
  </a>
</template>

<style>
.external-link {
  text-decoration: none;
  color: var(--link-color);
}
</style>
