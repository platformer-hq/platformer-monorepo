<script lang="ts" setup>
import {
  backButton,
  isRGB,
  miniApp,
  themeParams,
  useSignal,
  type RGB,
  type KnownThemeParamsKey as RawThemeParamsKey,
} from '@tma.js/sdk-vue';
import { useScroll } from '@vueuse/core';

import type { KnownThemeParamsKey as SimpleThemeParamsKey } from '~colors/types';
import { usePlatform } from '~ui-kit/_composables/usePlatform';

import type { PageRootExpose } from './_types';
import { useScrollStatesStore } from './_useScrollStates';
import { providePageRoot } from './utils/provider';

type RgbOrSimpleThemeParamsKey = RGB | SimpleThemeParamsKey;

type RgbOrThemeParamsKey = RGB | RawThemeParamsKey;

export interface PageRootProps {
  /**
   * Should the back button be displayed.
   * @default true
   */
  back?: boolean;
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
   * Insets to apply.
   * - `true` to apply all insets
   * - `false` to disable all insets
   * - array to apply specific insets
   * @default true
   */
  insets?: boolean | UseSafeAreaInsetsAttrsSide[];
  /**
   * Should the scrollbar be visible.
   */
  scrollbar?: boolean;
  /**
   * Scroll to top behavior. Values:
   * - `true` to forcibly scroll to top.
   * - `false` to disable scrolling to top.
   * - `default` to apply scroll based on the current routing state. Navigating forward will
   * scroll the view to top, when navigating back and reloading the view will not do it.
   * @default 'default'
   */
  scrollToTop?: boolean | 'default';
  onBack?(): void;
}

const props = withDefaults(defineProps<PageRootProps>(), {
  insets: true,
  back: true,
  scrollToTop: 'default',
});
defineSlots<{
  default(): unknown;
  bottomBar(): unknown;
}>();

const { b, e } = bem('page-root');
const rootRef = useTemplateRef('root');
const platform = usePlatform();
const router = useRouter();

//#region Back button adjustments.
const isBackButtonMounted = useSignal(backButton.isMounted);
watchPostEffect(() => {
  if (!isBackButtonMounted.value) {
    return;
  }
  if (!props.back) {
    return backButton.hide();
  }
  backButton.show();
  onWatcherCleanup(
    backButton.onClick(() => {
      if (props.onBack) {
        props.onBack();
      } else {
        router.back();
      }
    }),
  );
});
//#endregion

//#region UI colors adjustments.
const toRawThemeParamsKey = (value: RgbOrSimpleThemeParamsKey): RGB | RawThemeParamsKey => {
  return isKnownThemeParamsKey(value) ? knownThemeKeyToSdkKnownThemeKey(value) : value;
};
const rgbOrThemeKeyToRgb = (color: RgbOrThemeParamsKey | string): RGB | undefined => {
  return isRGB(color) ? color : themeParams.state()[color];
};
const areColorsSame = (
  a: RgbOrThemeParamsKey | string,
  b: RgbOrThemeParamsKey | string,
) => {
  return rgbOrThemeKeyToRgb(a) === rgbOrThemeKeyToRgb(b);
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
  const defaultColor: SimpleThemeParamsKey = 'bg';
  return {
    header: toRawThemeParamsKey(header || defaultColor),
    background: toRawThemeParamsKey(background || defaultColor),
    bottomBar: toRawThemeParamsKey(bottomBar || defaultColor),
  };
});

const headerColor = useSignal(miniApp.headerColor);
const bgColor = useSignal(miniApp.bgColor);
const bottomBarColor = useSignal(miniApp.bottomBarColor);

// We use post effect here as long as colors-related changes must be applied only when
// the DOM was updated. Otherwise, we will first see colors updated, but the view is not rendered
// yet.
watchPostEffect(() => {
  const { header, background, bottomBar } = colorsObject.value;
  if (!areColorsSame(headerColor.value, header)) {
    miniApp.setHeaderColor.ifAvailable(header);
  }
  if (!areColorsSame(bgColor.value, background)) {
    miniApp.setBgColor.ifAvailable(background);
  }
  if (!areColorsSame(bottomBarColor.value, bottomBar)) {
    miniApp.setBottomBarColor.ifAvailable(bottomBar);
  }
});
//#endregion

//#region Scrollbar and scroll adjustments.
const route = useRoute();
const routingDirection = useNavigationDirection();
const scrollStatesStore = useScrollStatesStore();

const { y: scrollTop } = useScroll(rootRef);
watch(() => [scrollTop.value, route.name] as const, ([y, routeName]) => {
  if (routeName) {
    scrollStatesStore.set(routeName, y);
  }
});

onMounted(() => {
  const direction = toValue(routingDirection);
  const { scrollToTop } = props;
  if (scrollToTop === true || (scrollToTop === 'default' && direction === 'forward')) {
    return scrollTop.value = 0;
  }
  if (scrollToTop === 'default' && direction === 'backward' && route.name) {
    scrollTop.value = scrollStatesStore.get(route.name) || 0;
  }
});
//#endregion

const insetsObject = computed(() => {
  const { insets } = props;
  return (
    insets === true
      ? ['left', 'right', 'bottom', 'top'] satisfies UseSafeAreaInsetsAttrsSide[]
      : insets === false
        ? []
        : insets
  ).reduce<{ [K in UseSafeAreaInsetsAttrsSide]?: true }>((acc, key) => {
    acc[key] = true;
    return acc;
  }, {});
});

const context: PageRootExpose = { scrollTop, rootElement: rootRef };
providePageRoot(context);
defineExpose(context);
</script>

<template>
  <div
    ref="root"
    :class="b({'no-scrollbar': !scrollbar})"
    :style="{background: colorReference(colorsObject.background)}"
  >
    <div :class="e('content', {elastic: platform === 'ios'})">
      <SafeAreaInsets v-bind="insetsObject">
        <slot />
      </SafeAreaInsets>
      <slot name="bottomBar"/>
    </div>
  </div>
</template>

<style lang="scss">
.page-root {
  height: 100vh;
  width: 100vw;
  overflow: hidden auto;

  &--no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  &__content {
    display: grid;
    grid-template-rows: 1fr auto;
    grid-template-columns: 100vw;
    height: 100%;

    &--elastic {
      height: calc(100% + 1px);
    }
  }
}
</style>
