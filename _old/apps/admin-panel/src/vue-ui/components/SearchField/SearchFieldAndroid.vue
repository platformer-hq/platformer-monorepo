<script setup lang="ts">
import { ref } from 'vue';
import { bem, Magnify24, Xmark24 } from 'vue-ui';

import TextAndroid from '@/vue-ui/components/Text/TextAndroid.vue';

const { type = 'text' } = defineProps<{
  placeholder?: string;
  type?: 'number' | 'text';
  onClear?(): void;
}>();
defineEmits<{
  clear: [];
}>();

const [b, e] = bem('tgui-search-field-android');
const value = defineModel<string | number>('value', { required: true });
const focused = ref(false);
</script>

<template>
  <label :class="b({ focused })">
    <Magnify24 :class="e('search-icon')" />
    <span :class="e('input')">
      <TextAndroid
        v-if="value === '' && placeholder"
        :class="e('placeholder')"
        variant="body1"
      >
        {{ placeholder }}
      </TextAndroid>
      <input
        v-bind="$attrs"
        v-model="value"
        :class="e('input-element')"
        :type="type"
        @focus="focused = true"
        @blur="focused = false"
      >
      <i
        v-if="type !== 'number' && value && onClear"
        :class="e('clear')"
        @click="$emit('clear')"
      >
        <Xmark24 :class="e('clear-icon')" />
      </i>
    </span>
  </label>
</template>

<style lang="scss">
@use "@/vue-ui/styles/mixins";

.tgui-search-field-android {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  position: relative;
  background: var(--tgui-search-field-android-bg, #7474801F);
  padding: 0 16px 0 12px;

  &__search-icon {
    flex: 0 0 auto;
    color: var(--tgui-search-field-android-icon-color, #8E8E93);
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
      color: var(--tgui-search-field-android-text-color, black);
    }
  }

  &__placeholder {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.8;
    color: var(--tgui-search-field-android-placeholder-color, #8E8E93);
    pointer-events: none;
    user-select: none;
  }

  &__clear {
    display: flex;
    align-items: center;
    color: var(--tgui-search-field-android-clear-color, #8E8E93);
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
