<script setup lang="ts">
import { bem, Magnify24, XmarkFill28 } from 'vue-ui';

import TextIos from '@/vue-ui/components/Text/TextIos.vue';

const { type = 'text' } = defineProps<{
  placeholder?: string;
  type?: 'number' | 'text';
  onClear?(): void;
}>();
defineEmits<{
  clear: [];
}>();

const [b, e] = bem('tgui-search-field-ios');
const value = defineModel<string | number>('value', { required: true });
</script>

<template>
  <label :class="b()">
    <Magnify24 :class="e('search-icon')" />
    <span :class="e('input')">
      <TextIos
        v-if="value === '' && placeholder"
        :class="e('placeholder')"
      >
        {{ placeholder }}
      </TextIos>
      <input
        v-bind="$attrs"
        v-model="value"
        :class="e('input-element')"
        :type="type"
      >
      <i
        v-if="type !== 'number' && value && onClear"
        :class="e('clear')"
        @click="$emit('clear')"
      >
        <XmarkFill28 :class="e('clear-icon')" />
      </i>
    </span>
  </label>
</template>

<style lang="scss">
@use "@/vue-ui/styles/mixins";

.tgui-search-field-ios {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  position: relative;
  background: var(--tgui-search-field-ios-bg, #7474801F);
  border-radius: 12px;
  padding: 0 16px 0 12px;

  &__search-icon {
    flex: 0 0 auto;
    color: var(--tgui-search-field-ios-icon-color, #8E8E93);
    width: 20px;
  }

  &__input {
    height: 100%;
    flex: 1 0 auto;
    display: flex;
    align-items: center;
    gap: 7px;

    &-element {
      border: none;
      background: transparent;
      appearance: none;
      height: 100%;
      padding: 0;
      outline: none;
      font-family: SF Pro, -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 17px;
      line-height: 22px;
      flex: 1 0 auto;
      color: var(--tgui-search-field-ios-text-color, black);
    }
  }

  &__placeholder {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.8;
    color: var(--tgui-search-field-ios-placeholder-color, #8E8E93);
    pointer-events: none;
    user-select: none;
  }

  &__clear {
    display: flex;
    align-items: center;
    color: var(--tgui-search-field-ios-clear-color, #8E8E93);
    box-sizing: border-box;
    flex: 0 0 auto;
    @include mixins.clickable;

    &-icon {
      display: block;
      width: 20px;
    }
  }
}
</style>
