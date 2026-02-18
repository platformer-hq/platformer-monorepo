<script setup lang="ts">
import { useSessionStorage } from '@vueuse/core';
import { computed } from 'vue';
import { bem } from 'vue-ui';

export interface PictureProps {
  png?: { srcset?: string };
  webp?: { srcset?: string };
  blurDataUrl?: string;
  src?: string;
  srcset?: string;
  width?: string | number;
  height?: string | number;
  class?: any;
}

const props = defineProps<PictureProps>();
defineOptions({ inheritAttrs: false });
const [b, e] = bem('picture');

const formatDimension = (v: number | string | undefined) => {
  return v === undefined
    ? v
    : typeof v === 'number' ? `${v}px` : v;
};

const width = computed(() => formatDimension(props.width));
const height = computed(() => formatDimension(props.height));
const isLoaded = useSessionStorage(
  () => [
    props.png?.srcset,
    props.webp?.srcset,
    props.src,
    props.srcset,
  ].filter(v => v).join(' '),
  false,
);

const onLeave = (el: Element, done: () => void) => {
  return el
    .animate({ opacity: [1, 0] }, { duration: 200, easing: 'ease-in-out' })
    .finished
    .then(done);
};
</script>

<template>
  <div
    :class="[b(), $props.class]"
    :style="{ width, height }"
  >
    <Transition @leave="onLeave">
      <img
        v-if="blurDataUrl && !isLoaded"
        alt=""
        :src="blurDataUrl"
        :class="e('blur')"
      >
    </Transition>
    <picture :class="e('pic', isLoaded && 'show')">
      <source
        v-for="variant in [
          { type: 'image/webp', srcset: webp?.srcset },
          { type: 'image/png', srcset: png?.srcset },
        ]"
        :key="variant.type"
        v-bind="variant"
        @load="isLoaded = true"
      >
      <img
        loading="lazy"
        :src
        :srcset
        @load="isLoaded = true"
      >
    </picture>
  </div>
</template>

<style lang="scss">
.picture {
  position: relative;

  &__pic {
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: 200ms opacity ease;

    &--show {
      opacity: 1;
    }
  }

  &__blur {
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    filter: blur(10px);
  }
}
</style>
