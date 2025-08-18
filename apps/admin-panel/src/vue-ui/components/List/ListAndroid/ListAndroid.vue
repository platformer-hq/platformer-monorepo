<script setup lang="ts">
import { computed, ref } from 'vue';
import { bem } from 'vue-ui';

import Text from '@/vue-ui/components/Text/TextAndroid.vue';

import { provideListOptions } from './provider';

const [b, e] = bem('tgui-list-android');

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
    <div :class="e('body')">
      <Text
        is="p"
        v-if="title"
        :class="e('title')"
        variant="button1"
      >
        {{ title }}
      </Text>
      <ul :class="e('list')">
        <slot />
      </ul>
    </div>
    <Text
      is="p"
      v-if="$slots.footer || footer"
      :class="e('footer')"
      variant="subtitle2"
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
.tgui-list-android {
  &__body {
    background: var(--tgui-list-android-body-bg, white);
  }

  &__title {
    padding: 19px 20px 3px;
    margin: 0;
    color: var(--tgui-list-android-title-color, #3A95D5);
  }

  &__list {
    appearance: none;
    display: block;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  &__footer {
    padding: 12px 20px;
    margin: 0;
    color: var(--tgui-list-android-footer-color, #8E8E93);
  }
}
</style>
