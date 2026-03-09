<script lang="ts" setup>
import type { RGB, KnownThemeParamsKey as RawThemeParamsKey } from '@tma.js/sdk-vue';
import { useScroll } from '@vueuse/core';

import type { KnownThemeParamsKey as SimpleThemeParamsKey } from '~/domains/colors/types';

import { PageRoot as UiKitPageRoot, type PageRootProps as UiKitPageRootProps } from '#layers/ui-kit';

import { useScrollStatesStore } from './useScrollStates';

type RgbOrSimpleThemeParamsKey = RGB | SimpleThemeParamsKey;

interface Props extends Omit<UiKitPageRootProps, 'elasticScroll' | 'colors'> {
  /**
   * List of colors to apply to the mini app UI elements. Passing an object with some keys missing
   * will lead to setting them to a default value.
   * @default 'bg'
   */
  colors?: RgbOrSimpleThemeParamsKey | {
    header?: RgbOrSimpleThemeParamsKey;
    background?: RgbOrSimpleThemeParamsKey;
    bottomBar?: RgbOrSimpleThemeParamsKey;
  };
  /**
   * Scroll to top behavior. Values:
   * - `true` to forcibly scroll to top.
   * - `false` to disable scrolling to top.
   * - `default` to apply scroll based on the current routing state. Navigating forward will
   * scroll the view to top, when navigating back and reloading the view will not do it.
   * @default 'default'
   */
  scrollToTop?: boolean | 'default';
}

const props = withDefaults(defineProps<Props>(), {
  insets: undefined,
  back: undefined,
  scrollToTop: 'default',
});
defineSlots<{
  default(): unknown;
  bottomBar(): unknown;
}>();

const rootRef = useTemplateRef('root');
const platform = useTmaPlatform();

//#region UI colors adjustments.
const toRawThemeParamsKey = (value: RgbOrSimpleThemeParamsKey): RGB | RawThemeParamsKey => {
  return isKnownThemeParamsKey(value) ? knownThemeKeyToSdkKnownThemeKey(value) : value;
};
const colorsObject = computed(() => {
  const { colors } = props;
  let header: RgbOrSimpleThemeParamsKey | undefined;
  let background: RgbOrSimpleThemeParamsKey | undefined;
  let bottomBar: RgbOrSimpleThemeParamsKey | undefined;
  if (typeof colors === 'object') {
    header = colors.header;
    background = colors.background;
    bottomBar = colors.bottomBar;
  } else {
    header = colors;
    background = colors;
    bottomBar = colors;
  }
  const defaultColor = 'bg';
  return {
    header: header || defaultColor,
    background: background || defaultColor,
    bottomBar: bottomBar || defaultColor,
  };
});
//#endregion

//#region Scrollbar and scroll adjustments.
const route = useRoute();
const routingDirection = useNavigationDirection();
const scrollStatesStore = useScrollStatesStore();

const { y: scrollTop } = useScroll(() => rootRef.value?.el);
watch(() => [scrollTop.value, route.name] as const, ([y, routeName]) => {
  if (routeName) {
    scrollStatesStore.set(routeName, y);
  }
});

onMounted(() => {
  const direction = routingDirection.value;
  const { scrollToTop } = props;
  if (scrollToTop === true || (scrollToTop === 'default' && direction === 'forward')) {
    return scrollTop.value = 0;
  }
  if (scrollToTop === 'default' && direction === 'backward' && route.name) {
    scrollTop.value = scrollStatesStore.get(route.name) || 0;
  }
});
//#endregion
</script>

<template>
  <UiKitPageRoot
    ref="root"
    :insets
    :elastic-scroll="platform.isMappedIos"
    :back
    :scrollbar
    :colors="{
      header: toRawThemeParamsKey(colorsObject.header),
      background: toRawThemeParamsKey(colorsObject.background),
      bottomBar: toRawThemeParamsKey(colorsObject.bottomBar),
    }"
    :style="{background: colorReference(colorsObject.background)}"
  >
    <slot/>
    <template #bottomBar>
      <slot name="bottomBar"/>
    </template>
  </UiKitPageRoot>
</template>
