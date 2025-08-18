<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue';
import { bem } from 'vue-ui';

import { injectPlatform } from '@/providers/platform';
import Text from '@/ui/adapters/Text.vue';

interface Props extends /* @vue-ignore */ HTMLAttributes {
  variant?: 'accent' | 'warning';
  icon: string | Component<{ class?: string }>;
  title: string;
}

const { variant = 'accent' } = defineProps<Props>();

const [b, e] = bem('callout');
const platform = injectPlatform();
</script>

<template>
  <aside :class="b(variant, platform)">
    <div :class="e('bg', variant)" />
    <div :class="e('header')">
      <i>
        <component
          :is="icon"
          :class="e('icon-image')"
        />
      </i>
      <Text
        variant="callout"
        weight="bold"
        :class="e('title')"
      >
        {{ title }}
      </Text>
    </div>
    <slot />
  </aside>
</template>

<style lang="scss">
.callout {
  padding: 16px;
  position: relative;
  overflow: hidden;

  &--ios {
    border-radius: 10px;
  }

  &--accent {
    color: var(--theme-accent-text-color);
  }

  &--warning {
    color: var(--accent-orange);
  }

  &__bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.2;
    z-index: -1;

    &--accent {
      background: var(--theme-accent-text-color);
    }

    &--warning {
      background: var(--accent-orange);
    }
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  &__title {
    color: var(--theme-text-color);
  }

  &__icon-image {
    display: block;
    width: 20px;
    height: unset;
    max-height: 20px;
  }
}
</style>
