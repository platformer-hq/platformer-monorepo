<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core';

import { usePlatform } from '~ui-kit/_composables/usePlatform.js';

import type { ButtonBaseProps } from './ButtonBase.vue';

export interface ButtonProps extends ButtonBaseProps {
  /**
   * @default 'regular'
   */
  variant?: 'regular' | 'small' | 'multiline' | 'medium';
}

withDefaults(defineProps<ButtonProps>(), {
  clickable: undefined,
  variant: 'regular',
  active: undefined,
  ripples: undefined,
  highlightOnActive: undefined,
  pressable: undefined,
});

const rootRef = useTemplateRef('root');
const platform = usePlatform();

const { b } = bem('v-button');

defineExpose({ element: computed(() => rootRef.value?.element) });
</script>

<template>
  <ButtonBase
    ref="root"
    v-bind="reactiveOmit($props, 'variant')"
    :class="b(`${platform}-${variant}`)"
  >
    <slot/>
  </ButtonBase>
</template>

<style lang="scss">
.v-button {
  &--android {
    &-regular {
      padding: 12px 30px 12px 24px;
      min-height: 48px;
      border-radius: 28px;
    }

    &-multiline {
      padding: 7px 24px 8px;
      min-height: 58px;
      border-radius: 16px;
      display: grid;
      align-items: center;
      justify-content: center;
    }

    &-small {
      padding: 6px 12px;
      min-height: 28px;
      border-radius: 1000px;
    }

    &-medium {
      padding: 4px 16px;
      min-height: 34px;
      border-radius: 1000px;
    }
  }

  &--ios {
    &-regular {
      padding: 10px 24px;
      min-height: 50px;
      border-radius: 25px;
    }

    &-multiline {
      padding: 8px 24px;
      min-height: 62px;
      border-radius: 16px;
      display: grid;
      align-items: center;
      justify-content: center;
    }

    &-medium {
      padding: 4px 16px;
      min-height: 34px;
      border-radius: 1000px;
    }

    &-small {
      padding: 4px 12px;
      min-height: 28px;
      border-radius: 1000px;
    }
  }
}
</style>
