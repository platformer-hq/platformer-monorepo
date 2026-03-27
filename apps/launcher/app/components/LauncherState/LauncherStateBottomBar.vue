<script setup lang="ts">
import { ButtonAndroid, ButtonIos } from '#packages/ui-kit';

defineProps<{ show: boolean }>();
defineEmits<{ buttonClick: [] }>();

const { t } = useI18n({
  messages: {
    en: { label: 'Retry again' },
    ru: { label: 'Попробовать снова' },
  },
});

const { e } = bem('launcher-state-bottom-bar');
const buttons = [
  { os: 'ios', component: ButtonIos },
  { os: 'android', component: ButtonAndroid },
] as const;
</script>

<template>
  <BottomBarTransition>
    <BottomBar v-if="show">
      <BottomBarInner>
        <template v-for="button in buttons" :key="button.os">
          <component
            :is="button.component"
            :class="e('button', button.os)"
            full-width
            @click="$emit('buttonClick')"
          >
            <VTypography variant="body" weight="medium">
              {{ t('label') }}
            </VTypography>
          </component>
        </template>
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
