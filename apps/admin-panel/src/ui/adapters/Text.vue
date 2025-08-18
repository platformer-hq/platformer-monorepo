<script setup lang="ts">
import TextAndroid from '@/vue-ui/components/Text/TextAndroid.vue';
import type { TextBaseProps } from '@/vue-ui/components/Text/TextBase.vue';
import TextIos from '@/vue-ui/components/Text/TextIos.vue';

import WithPlatform from './WithPlatform.vue';

export type TextVariant = 'title1' | 'title2' | 'footnote' | 'callout' | 'body';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export interface TextProps extends TextBaseProps {
  variant?: TextVariant;
  weight?: TextWeight;
}

defineProps<TextProps>();
defineOptions({ inheritAttrs: false });
</script>

<template>
  <WithPlatform>
    <template #ios>
      <TextIos v-bind="{...$attrs, ...$props}">
        <slot />
      </TextIos>
    </template>
    <template #android>
      <TextAndroid
        v-bind="{...$attrs, ...$props}"
        :variant="variant ? ({
          title1: 'headline5',
          title2: 'headline6',
          body: 'body1',
          callout: 'body1',
          footnote: 'caption1',
        } as const)[variant] : undefined"
        :weight="weight ? ({
          regular: 'regular',
          medium: 'medium',
          semibold: 'medium',
          bold: 'medium',
        } as const)[weight] : undefined"
      >
        <slot />
      </TextAndroid>
    </template>
  </WithPlatform>
</template>
