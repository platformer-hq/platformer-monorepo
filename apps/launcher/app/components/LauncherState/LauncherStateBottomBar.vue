<script setup lang="ts">
import { ButtonAndroid, ButtonIos, LoadingIndicatorAndroid, LoadingIndicatorIos } from '#packages/ui-kit';

defineProps<{
  action?: 'retry' | 'redirect' | 'redirecting';
}>();
defineEmits<{
  retry: [];
  redirect: [];
}>();

const { t } = useI18n({
  messages: {
    en: {
      'button.label.retry': 'Try again',
      'button.label.redirect': 'Redirect',
      'button.label.redirecting': 'Redirecting',
    },
    ru: {
      'button.label.retry': 'Попробовать снова',
      'button.label.redirect': 'Перенаправить',
      'button.label.redirecting': 'Перенаправляем',
    },
  },
});

const { e } = bem('launcher-state-bottom-bar');
const buttons = [
  { os: 'ios', component: ButtonIos, indicator: LoadingIndicatorIos },
  { os: 'android', component: ButtonAndroid, indicator: LoadingIndicatorAndroid },
] as const;

const loadingIndicatorTransition = createReversibleTransition({
  animatedProperties({ transition, el }) {
    return reverseTransitionKeyframesIfLeave({
      opacity: [0, 0, 1],
      transform: ['scale(0.93)', 'scale(1)'],
      marginLeft: ['0px', '8px', '8px'],
      width: ['0px', el.clientWidth + 'px'],
    }, transition);
  },
  animationOptions: { duration: 300, easing: 'ease-out', fill: 'both' },
});
</script>

<template>
  <BottomBarTransition>
    <BottomBar v-if="action">
      <BottomBarInner>
        <component
          :is="button.component"
          v-for="button in buttons"
          :key="button.os"
          :class="e('button', button.os)"
          full-width
          :active="action !== 'redirecting'"
          :disabled="action === 'redirecting'"
          @click="action === 'redirect' ? $emit('redirect') : $emit('retry')"
        >
          <VTypography variant="body" weight="medium">
            {{ t({
              retry: 'button.label.retry',
              redirect: 'button.label.redirect',
              redirecting: 'button.label.redirecting',
            }[action]) }}
          </VTypography>
          <Transition v-bind="loadingIndicatorTransition" :css="false">
            <component
              :is="button.indicator"
              v-if="action === 'redirecting'"
              :size="20"
            />
          </Transition>
        </component>
      </BottomBarInner>
    </BottomBar>
  </BottomBarTransition>
</template>

<style lang="scss">
.launcher-state-bottom-bar {
  &__button {
    background-color: var(--button-color);
    color: var(--button-text-color);

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
