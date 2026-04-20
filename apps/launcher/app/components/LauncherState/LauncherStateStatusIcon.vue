<script setup lang="ts">
import {
  IconXmark28,
  IconExclamationMarkTriangleFill28,
  LoadingIndicatorAndroid,
  LoadingIndicatorIos,
  bem,
  createReversibleTransition,
} from '@tma.js/vue-kit';

defineProps<{
  status?: 'error' | 'warning' | 'loading';
}>();
const { b } = bem('launcher-state-status-icon');

const platform = usePlatform();

const transition = createReversibleTransition({
  animatedProperties: {
    transform: [0.65, 1.1, 1].map(scale => `translate3d(-75%, -75%, 0) scale(${scale})`),
    opacity: [0, 1],
  },
  animationOptions: { duration: 300, easing: 'ease-in-out', fill: 'forwards' },
});
</script>

<template>
  <Transition v-bind="transition" :css="false" mode="out-in" appear>
    <div v-if="status === 'error'" :class="b('error')">
      <IconXmark28 :size="16"/>
    </div>
    <div v-else-if="status === 'warning'" :class="b('warning')">
      <IconExclamationMarkTriangleFill28 :size="16"/>
    </div>
    <div v-else-if="status === 'loading'" :class="b('loading')">
      <LoadingIndicatorIos v-if="platform === 'ios'" :size="16"/>
      <LoadingIndicatorAndroid v-else :size="16"/>
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
  transform: translate3d(-75%, -75%, 0);
  outline: 3px solid var(--bg-color);
  outline-offset: -0.5px;

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
    background: var(--secondary-bg-color);
    color: var(--text-color);
  }
}
</style>
