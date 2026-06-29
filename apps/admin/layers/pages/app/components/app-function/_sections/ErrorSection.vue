<script setup lang="ts">
defineProps<{
  error?: string;
}>();

const { b, e } = bem('app-function-page-error-section');
</script>

<template>
  <Transition
    v-bind="createReversibleTransition({
      animatedProperties({ el, transition }) {
        return reverseTransitionKeyframesIfLeave({
          height: ['0px', el.clientHeight + 'px'],
          opacity: [0, 1],
          paddingTop: ['0', '12px'],
        }, transition);
      },
      animationOptions: { duration: 300, easing: 'ease-out' },
    })"
    :css="false"
  >
    <div v-if="error" :class="b()">
      <AutoRoundedPanel :class="e('panel')">
        <AutoTypography variant="body">
          {{ error }}
        </AutoTypography>
      </AutoRoundedPanel>
    </div>
  </Transition>
</template>

<style lang="scss">
.app-function-page-error-section {
  padding-top: 12px;

  &__panel {
    background-color: var(--destructive-opaque-bg-color);
    color: var(--destructive-text-color);
    padding: 16px;
  }
}
</style>
