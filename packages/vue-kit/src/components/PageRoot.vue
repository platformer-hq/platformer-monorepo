<script lang="ts" setup>
import {
  backButton,
  isRGB,
  miniApp,
  themeParams,
  useSignal,
  type RGB,
  type KnownThemeParamsKey,
} from '@tma.js/sdk-vue';
import { useTemplateRef, watchPostEffect, onWatcherCleanup, computed } from 'vue';

import SafeAreaInsets from '@/components/SafeAreaInsets/SafeAreaInsets.vue';
import type { UseSafeAreaInsetsAttrsSide } from '@/components/SafeAreaInsets/useSafeAreaInsetsAttrs';
import { bem } from '@/utils/bem';

type RgbOrThemeParamsKey = RGB | KnownThemeParamsKey;

export interface PageRootProps {
  /**
   * Should the elastic scroll be applied to the page content.
   */
  elasticScroll?: boolean;
  /**
   * Should the back button be displayed.
   * @default true
   */
  back?: boolean;
  /**
   * List of colors to apply to the mini app UI elements. Passing an object with some keys missing
   * will lead to setting them to a default value.
   * @default 'bg_color'
   */
  colors?: (
    | RgbOrThemeParamsKey
    | { [K in 'header' | 'background' | 'bottomBar']?: RgbOrThemeParamsKey }
  );
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
}

const props = withDefaults(defineProps<PageRootProps>(), {
  insets: true,
  back: true,
});
defineSlots<{
  default(): unknown;
  bottomBar(): unknown;
}>();
const emit = defineEmits<{ back: [] }>();

const { b, e } = bem('tgui-page-root');
const rootRef = useTemplateRef('root');

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
      emit('back');
    }),
  );
});
//#endregion

//#region UI colors adjustments.
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
  let header: RgbOrThemeParamsKey | undefined;
  let background: RgbOrThemeParamsKey | undefined;
  let bottomBar: RgbOrThemeParamsKey | undefined;
  if (typeof colors === 'object') {
    header = colors.header;
    background = colors.background;
    bottomBar = colors.bottomBar;
  } else {
    header = colors;
    background = colors;
    bottomBar = colors;
  }
  const defaultColor: KnownThemeParamsKey = 'bg_color';
  return {
    header: header || defaultColor,
    background: background || defaultColor,
    bottomBar: bottomBar || defaultColor,
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

defineExpose({ element: rootRef });
</script>

<template>
  <div
    ref="root"
    :class="b({'no-scrollbar': !scrollbar})"
    :style="{background: isRGB(colorsObject.background) ? colorsObject.background : undefined}"
  >
    <div :class="e('content', {elastic: elasticScroll})">
      <SafeAreaInsets v-bind="insetsObject">
        <slot />
      </SafeAreaInsets>
      <slot name="bottomBar"/>
    </div>
  </div>
</template>

<style lang="scss">
.tgui-page-root {
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
