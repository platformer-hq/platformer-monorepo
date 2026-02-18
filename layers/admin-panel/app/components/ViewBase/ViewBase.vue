<script lang="ts" setup>
/**
 * This component is used as a base for all other views. It performs all required view setups.
 */
import {
  backButton,
  isRGB,
  miniApp,
  themeParams,
  useSignal,
  type RGB,
  type KnownThemeParamsKey as SdkKnownThemeParamsKey,
} from '@tma.js/sdk-vue';
import { useScroll } from '@vueuse/core';

import type { KnownThemeParamsKey } from '~/domains/colors/types';

import type { ViewBaseExpose } from './types';
import { useScrollStates } from './useScrollStates';

type RgbOrKnownThemeParamsKey = RGB | KnownThemeParamsKey;

interface Colors {
  header?: RgbOrKnownThemeParamsKey;
  background?: RgbOrKnownThemeParamsKey;
  bottomBar?: RgbOrKnownThemeParamsKey;
}

export interface ViewBaseProps {
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
  colors?: RgbOrKnownThemeParamsKey | Colors;
  /**
   * Insets to apply.
   */
  insets?: boolean | ('left' | 'right' | 'bottom' | 'top')[];
  onBack?(): void;
  /**
   * Should the scrollbar be visible.
   * @default false
   */
  scrollbar?: boolean;
  /**
   * Scroll to top behavior. Values:
   * - True to forcibly scroll to top.
   * - False to disable scroll to top.
   * - `default` to apply scroll based on the current routing state. Navigating forward will
   * scroll the view to top, when navigating back and reloading the view will not do it.
   * @default 'default'
   */
  scrollToTop?: boolean | 'default';
}

const {
  insets = true,
  back = true,
  scrollToTop = 'default',
  colors = { header: 'bg', background: 'bg', bottomBar: 'bg' },
  ...props
} = defineProps<ViewBaseProps>();
defineEmits<{ back: [] }>();
const { b, e } = bem('view-base');

const rootRef = useTemplateRef('root');
const rootElement = computed(() => rootRef.value?.element);
const platform = useTmaPlatform();

//#region Back button adjustments.
const router = useRouter();
watchPostEffect(() => {
  if (!back) {
    return backButton.hide();
  }
  backButton.show();
  onWatcherCleanup(backButton.onClick(props.onBack || (() => {
    router.go(-1);
  })));
});
//#endregion

//#region UI colors adjustments.
const anyColorToRgbOrThemeKey = (value: RgbOrKnownThemeParamsKey): RGB | SdkKnownThemeParamsKey => {
  return isKnownThemeParamsKey(value) ? knownThemeKeyToSdkKnownThemeKey(value) : value;
};
const rgbOrThemeKeyToRgb = (color: RGB | SdkKnownThemeParamsKey | string): RGB | undefined => {
  return isRGB(color) ? color : themeParams.state()[color];
};
const areColorsSame = (
  a: RGB | SdkKnownThemeParamsKey | string,
  b: RGB | SdkKnownThemeParamsKey | string,
) => {
  return rgbOrThemeKeyToRgb(a) === rgbOrThemeKeyToRgb(b);
};
const colorsMapped = computed(() => {
  let header: RgbOrKnownThemeParamsKey | undefined;
  let background: RgbOrKnownThemeParamsKey | undefined;
  let bottomBar: RgbOrKnownThemeParamsKey | undefined;
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
const colorsFinal = computed(() => {
  return {
    header: anyColorToRgbOrThemeKey(colorsMapped.value.header),
    background: anyColorToRgbOrThemeKey(colorsMapped.value.background),
    bottomBar: anyColorToRgbOrThemeKey(colorsMapped.value.bottomBar),
  };
});

const headerColor = useSignal(miniApp.headerColor);
const bgColor = useSignal(miniApp.bgColor);
const bottomBarColor = useSignal(miniApp.bottomBarColor);

// We use post effect here as long as colors-related changes must be applied only when
// the DOM was updated. Otherwise, we will first see colors updated, but the view is not rendered
// yet.
watchPostEffect(() => {
  const { header, background, bottomBar } = colorsFinal.value;
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
const scrollStates = useScrollStates();

const { y: scrollTop } = useScroll(rootElement);
watch(() => [scrollTop.value, route.name] as const, ([y, routeName]) => {
  if (routeName) {
    scrollStates.set(routeName, y);
  }
});

onMounted(() => {
  const direction = routingDirection.value;
  if (scrollToTop === true || (scrollToTop === 'default' && direction === 'forward')) {
    return scrollTop.value = 0;
  }
  if (scrollToTop === 'default' && direction === 'backward' && route.name) {
    scrollTop.value = scrollStates.get(route.name) || 0;
  }
});
//#endregion

const context: ViewBaseExpose = { scrollTop, rootElement };
provideViewBaseContext(context);
defineExpose(context);

// TODO: Yeah, the bottom block imitating the bottom inset is not the greatest solution, but I
// wasn't able to find any reliable solution considering that inner element has height = 100vh.

// FIXME: Check insets.
// insets === true
//         ? ['top', 'left', 'right']
//         : Array.isArray(insets)
//           ? insets.filter(i => i !== 'bottom')
//           : false
</script>

<template>
  <SafeAreaInsets
    ref="root"
    as="div"
    left
    right
    top
    :class="b({'no-scrollbar': !scrollbar})"
    :style="{background: colorReference(colorsMapped.background)}"
  >
    <div :class="e('inner', platform?.mapped)">
      <slot />
      <SafeAreaInsets
        v-if="insets && (insets === true || insets.includes('bottom'))"
        bottom
      />
    </div>
  </SafeAreaInsets>
</template>

<style lang="scss">
.view-base {
  height: 100vh;
  overflow: hidden auto;

  &--no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  &__inner {
    &--android {
      height: 100%;
    }

    &--ios {
      // We add 1px to make the elastic search appear.
      height: calc(100% + 1px);
    }
  }
}
</style>
