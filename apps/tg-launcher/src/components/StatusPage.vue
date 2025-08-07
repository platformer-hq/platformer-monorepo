<script setup lang="ts">
import { bem, LoadingIndicatorAndroid, LoadingIndicatorIos, Xmark28 } from 'vue-ui';

import platformerLogoSrc from '@/assets/platformer-logo.svg';
import Disclaimer from '@/components/Disclaimer.vue';
import Text from '@/components/Text.vue';
import { injectGlobals } from '@/providers/global.ts';

defineProps<{
  state?: 'error' | 'loading';
  title?: string;
}>();

const [b, e] = bem('status-page');
const { platform } = injectGlobals();
</script>

<template>
  <div :class="b()">
    <div />
    <div :class="e('main')">
      <div :class="e('image')">
        <img
          alt=""
          :class="e('logo')"
          :src="platformerLogoSrc"
        >
        <Xmark28
          v-if="state === 'error'"
          :class="e('error-icon')"
        />
      </div>
      <div :class="e('content')">
        <Text
          v-if="title"
          as="h1"
          :class="e('title')"
          variant="heading"
        >
          {{ title }}
        </Text>
        <Text
          v-if="$slots.default"
          :class="e('subtitle')"
          variant="body"
        >
          <slot />
        </Text>
      </div>
      <div
        v-if="state === 'loading'"
        :class="e('loader', platform)"
      >
        <LoadingIndicatorIos
          v-if="platform === 'ios'"
          :size="28"
        />
        <LoadingIndicatorAndroid
          v-else
          :size="28"
        />
      </div>
    </div>
    <Disclaimer />
  </div>
</template>

<style lang="scss">
@use "sass:map" as map;
@use "sass:list" as list;

$baseLoaderSize: 28px;
$errorIconShift: translate(20%, 20%);

.status-page {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  position: absolute;
  background: var(--theme-bg-color);
  padding-top: calc(var(--sum-inset-top) + 8px);
  padding-bottom: calc(var(--sum-inset-bottom) + 8px);

  &__image {
    margin-bottom: 16px;
    position: relative;
  }

  &__logo {
    display: block;
  }

  &__error-icon {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: $errorIconShift;
    display: block;
    width: 16px;
    height: 16px;
    padding: 4px;
    box-sizing: content-box;
    border-radius: 50%;
    color: white;
    background: var(--theme-destructive-text-color);
    animation: status-page-error-icon-appear 400ms ease forwards;

    path {
      stroke-width: 4;
    }
  }

  &__loader {
    padding-top: 16px;
    color: var(--theme-hint-color);
  }

  &__main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-right: calc(var(--sum-inset-right) + 16px);
    padding-left: calc(var(--sum-inset-left) + 16px);
  }

  &__content {
    text-align: center;
    text-wrap: balance;
    animation: status-page-content-appear 200ms ease forwards;
  }

  &__title {
    margin: 0 0 4px;
  }

  &__subtitle {
    margin: 0;
    color: var(--theme-subtitle-text-color);
  }
}

@keyframes status-page-error-icon-appear {
  from {
    opacity: 0;
    transform: $errorIconShift translateZ(0) scale(.65);
  }

  50% {
    transform: $errorIconShift translateZ(0) scale(1.2);
  }

  to {
    opacity: 1;
    transform: $errorIconShift translateZ(0) scale(1);
  }
}

@keyframes status-page-content-appear {
  from {
    opacity: 0;
    max-height: $baseLoaderSize;
  }

  to {
    opacity: 1;
    max-height: 30vh;
  }
}
</style>
