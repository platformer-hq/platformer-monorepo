<script setup lang="ts">
import platformerLogoSrc from '@/assets/platformer-logo.svg';

defineProps<{
  state?: 'error' | 'loading' | 'warning';
  title?: string;
}>();

const { b, e } = bem('status-page');
</script>

<template>
  <div :class="b()">
    <div />
    <div :class="e('main')">
      <div :class="e('image')">
        <ProgressiveImage
          v-slot="{src, srcset, onError, onLoad, isLoaded, isLoading, isError}"
          :src="platformerLogoSrc"
          :class="e('logo')"
          width="80"
          height="80"
        >
          <ProgressiveImageTransition>
            <ProgressiveImageShimmer v-if="isLoading"/>
            <ProgressiveImagePlaceholder v-else-if="isError"/>
          </ProgressiveImageTransition>
          <ProgressiveImageElement v-bind="{src, srcset, onError, onLoad, show: isLoaded}"/>
        </ProgressiveImage>
        <IconXmark28 v-if="state === 'error'" :class="e('icon', 'error')"/>
        <IconExclamationMarkTriangleFill28
          v-else-if="state === 'warning'"
          :class="e('icon', 'warning')"
        />
      </div>
      <div :class="e('content')">
        <ClientOnly>
          <VTypography v-if="title" as="h1" variant="title">
            {{ title }}
          </VTypography>
          <VTypography v-if="$slots.default" :class="e('subtitle')" variant="body">
            <slot />
          </VTypography>
          <template #fallback>
            Server side
          </template>
        </ClientOnly>
      </div>
      <div v-if="state === 'loading'" :class="e('loader')">
        <!-- <AutoLoadingIndicator :size="28"/> -->
      </div>
    </div>
    <!-- <Disclaimer /> -->
  </div>
</template>

<style lang="scss">
@use "sass:map" as map;
@use "sass:list" as list;

$baseLoaderSize: 28px;
$statusIconShift: translate(20%, 20%);

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
    border-radius: 16px;
    overflow: hidden;
  }

  &__icon {
    @keyframes status-page-error-icon-appear {
      from {
        opacity: 0;
        transform: $statusIconShift translateZ(0) scale(.65);
      }
      50% {
        transform: $statusIconShift translateZ(0) scale(1.2);
      }
      to {
        opacity: 1;
        transform: $statusIconShift translateZ(0) scale(1);
      }
    }
    position: absolute;
    right: 0;
    bottom: 0;
    transform: $statusIconShift;
    display: block;
    width: 16px;
    height: 16px;
    padding: 4px;
    box-sizing: content-box;
    border-radius: 50%;
    color: white;
    animation: status-page-error-icon-appear 400ms ease forwards;

    &--error {
      background: var(--theme-destructive-text-color);

      path {
        stroke-width: 4;
      }
    }

    &--warning {
      background: orange;
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
    text-align: center;
    text-wrap: balance;
    animation: status-page-content-appear 200ms ease forwards;
  }

  &__subtitle {
    margin: 4px 0 0;
    color: var(--theme-subtitle-text-color);
  }
}
</style>
