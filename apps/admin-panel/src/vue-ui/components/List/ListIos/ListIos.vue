<script setup lang="ts">
import { computed, ref } from 'vue';
import { bem } from 'vue-ui';

import Text from '@/vue-ui/components/Text/TextIos.vue';

import { provideListOptions } from './provider';

const [b, e] = bem('tgui-list-ios');

defineProps<{
  title?: string;
  footer?: string;
}>();
defineSlots<{
  default(): any;
  footer(): any;
}>();

const registry = ref<symbol[]>([]);
provideListOptions({
  register() {
    const id = Symbol();
    registry.value.push(id);
    return id;
  },
  unregister(id) {
    registry.value = registry.value.filter(v => v !== id);
  },
  firstItem: computed(() => registry.value[0]),
});
</script>

<template>
  <div :class="b()">
    <Text
      is="p"
      v-if="title"
      :class="e('title')"
      caps
      variant="footnote"
    >
      {{ title }}
    </Text>
    <ul :class="e('list')">
      <slot />
    </ul>
    <Text
      is="p"
      v-if="$slots.footer || footer"
      :class="e('footer')"
      variant="footnote"
    >
      <slot
        v-if="$slots.footer"
        name="footer"
      />
      <template v-else>
        {{ footer }}
      </template>
    </Text>
  </div>
</template>

<style lang="scss">
.tgui-list-ios {
  &__title {
    padding: 5px 16px;
    margin: 0;
    color: var(--tgui-list-ios-title-color, #6D6D72);
  }

  &__list {
    appearance: none;
    display: block;
    margin: 0;
    padding: 0;
    background: var(--tgui-list-ios-list-bg, white);
    border-radius: 10px;
    overflow: hidden;
  }

  &__footer {
    padding: 5px 16px;
    margin: 0;
    color: var(--tgui-list-ios-footer-color, #8E8E93);
  }
}
</style>
