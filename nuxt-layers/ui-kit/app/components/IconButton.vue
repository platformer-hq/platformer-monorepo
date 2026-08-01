<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core';

import { usePlatform } from '~/_composables/usePlatform.js';

import type { ButtonBaseProps } from './ButtonBase.vue';

export interface IconButtonProps extends ButtonBaseProps {
  /**
   * @default 'regular'
   */
  variant?: 'regular' | 'small' | 'medium';
}

withDefaults(defineProps<IconButtonProps>(), {
  clickable: undefined,
  variant: 'regular',
  active: undefined,
  ripples: undefined,
  highlightOnActive: undefined,
  pressable: undefined,
});

const rootRef = useTemplateRef('root');
const platform = usePlatform();

defineExpose({ element: computed(() => rootRef.value?.element) });

const { b } = bem('icon-button');
</script>

<template>
  <ButtonBase
    ref="root"
    :class="b(`${platform}-${variant}`)"
    v-bind="reactiveOmit($props, 'variant')"
  >
    <slot/>
  </ButtonBase>
</template>

<style lang="scss">
.icon-button {
  aspect-ratio: 1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &--android {
    &-small {
      width: 28px;
    }

    &-medium {
      width: 34px;
    }

    &-regular {
      width: 48px;
    }
  }

  &--ios {
    &-small {
      width: 28px;
    }

    &-medium {
      width: 34px;
    }

    &-regular {
      width: 50px;
    }
  }
}
</style>
