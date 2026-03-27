<script setup lang="ts">
defineProps<{
  status: 'error' | 'warning' | 'loading';
}>();
const { b, e } = bem('launcher-state-status-icon');
</script>

<template>
  <IconXmark28 v-if="status === 'error'" :class="b('error')"/>
  <IconExclamationMarkTriangleFill28 v-else-if="status === 'warning'" :class="b('warning')"/>
  <div v-else-if="status === 'loading'" :class="b('loading')">
    <LoadingIndicatorIos :class="e('loading-indicator', 'ios')" :size="14"/>
    <LoadingIndicatorAndroid :class="e('loading-indicator', 'android')" :size="14"/>
  </div>
</template>

<style lang="scss">
.launcher-state-status-icon {
  $transform: translate3d(-75%, -75%, 0);
  @keyframes status-page-error-icon-appear {
    from {
      opacity: 0;
      transform: $transform scale(.65);
    }
    50% {
      transform: $transform scale(1.2);
    }
    to {
      opacity: 1;
      transform: $transform scale(1);
    }
  }
  position: absolute;
  top: 100%;
  left: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 4px;
  box-sizing: content-box;
  border-radius: 50%;
  color: white;
  animation: status-page-error-icon-appear 400ms ease forwards;

  &--error {
    background: var(--destructive-text-color);

    path {
      stroke-width: 4;
    }
  }

  &--warning {
    background: orange;
  }

  &--loading {
    background: var(--text-color);
    color: var(--bg-color);
  }

  &__loading-indicator {
    display: none;
    @each $platform in ("ios", "android") {
      [data-platform="#{$platform}"] & {
        &--#{$platform} {
          display: flex;
        }
      }
    }
  }
}
</style>
