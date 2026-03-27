<script setup lang="ts">
defineProps<{
  status: 'error' | 'warning' | 'loading';
}>();
const { b, e } = bem('launcher-state-status-icon');

const transition = createReversibleTransition({
  animatedProperties: {
    transform: [0.75, 1.1, 1].map(scale => `translate3d(-75%, -75%, 0) scale(${scale})`),
    opacity: [0, 1],
  },
  animationOptions: { duration: 400, easing: 'ease-in-out', fill: 'forwards' },
});
</script>

<template>
  <Transition v-bind="transition" :css="false">
    <div v-if="status === 'error'" :class="b('error')">
      <IconXmark28 :size="16"/>
    </div>
    <div v-else-if="status === 'warning'" :class="b('warning')">
      <IconExclamationMarkTriangleFill28 :size="16"/>
    </div>
    <div v-else-if="status === 'loading'" :class="b('loading')">
      <LoadingIndicatorIos :class="e('loading-indicator', 'ios')" :size="14"/>
      <LoadingIndicatorAndroid :class="e('loading-indicator', 'android')" :size="14"/>
    </div>
  </Transition>
</template>

<style lang="scss">
.launcher-state-status-icon {
  position: absolute;
  top: 100%;
  left: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 6px;
  box-sizing: content-box;
  border-radius: 50%;
  color: white;

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
