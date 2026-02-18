<script setup lang="ts">
import { openLink, openTelegramLink } from '@telegram-apps/sdk-vue';
import type { AnchorHTMLAttributes } from 'vue';
import type { RouterLinkProps } from 'vue-router';

export interface LinkProps extends /* @vue-ignore */ Omit<AnchorHTMLAttributes, 'href'>,
  RouterLinkProps {
}

defineProps<LinkProps>();
defineOptions({ inheritAttrs: false });
</script>

<template>
  <a
    v-if="typeof to === 'string' && to.startsWith('http')"
    v-bind="$attrs"
    :href="to"
    class="link"
    @click="
      $event.preventDefault();
      if (to.startsWith('https://t.me')) {
        openTelegramLink(to);
      } else {
        openLink(to);
      }
    "
  >
    <slot />
  </a>
  <router-link
    v-else
    v-slot="{ href, navigate }"
    v-bind="$props"
    custom
  >
    <a
      v-bind="$attrs"
      :href="href"
      class="link"
      @click="navigate"
    >
      <slot />
    </a>
  </router-link>
</template>

<style lang="scss">
@use "@/vue-ui/styles/mixins";

.link {
  text-decoration: none;
  color: var(--theme-link-color);
  @include mixins.clickable;
}
</style>
