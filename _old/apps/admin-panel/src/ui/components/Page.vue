<script setup lang="ts">
import {
  isMainButtonVisible as _isMainButtonVisible,
  isSecondaryButtonVisible as _isSecondaryButtonVisible,
  hideBackButton,
  onBackButtonClick,
  setMainButtonParams,
  setSecondaryButtonParams,
  showBackButton,
  useSignal,
} from '@telegram-apps/sdk-vue';
import { onMounted, onWatcherCleanup, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { bem } from 'vue-ui';

const [b] = bem('page');
const router = useRouter();
const {
  preserveMainButton,
  preserveSecondaryButton,
  fullHeight,
  back,
  onBack,
  scrollbar = true,
} = defineProps<{
  /**
   * True if the page should take all available height.
   */
  fullHeight?: boolean;
  /**
   * Behavior to use for the back button.
   * - `preserve` - don't apply any behavior.
   * - `disable` - hide the Back Button.
   * @default Navigation back will be called if no "back" event listener was provided.
   */
  back?: 'preserve' | 'disable';
  onBack?(): void;
  /**
   * Should the Main Button be preserved.
   */
  preserveMainButton?: boolean;
  /**
   * Should the Secondary Button be preserved.
   */
  preserveSecondaryButton?: boolean;
  /**
   * True if the page must contain scrollbar.
   * @default true
   */
  scrollbar?: boolean;
}>();
defineEmits<{ back: [] }>();

const isMainButtonVisible = useSignal(_isMainButtonVisible);
const isSecondaryButtonVisible = useSignal(_isSecondaryButtonVisible);

watchEffect(() => {
  if (back === 'preserve') {
    return;
  }
  if (back === 'disable') {
    hideBackButton();
  } else {
    showBackButton();
    onWatcherCleanup(onBackButtonClick(onBack || (() => {
      router.go(-1);
    })));
  }
});

watchEffect(() => {
  if (!preserveMainButton && isMainButtonVisible.value) {
    setMainButtonParams({ isVisible: false });
  }
});

onMounted(() => {
  if (!preserveSecondaryButton && isSecondaryButtonVisible.value) {
    setSecondaryButtonParams({ isVisible: false });
  }
});
</script>

<template>
  <div :class="b({ 'full-height': fullHeight, 'no-scrollbar': !scrollbar })">
    <slot name="default" />
  </div>
</template>

<style lang="scss">
@use "@/styles/mixins";

.page {
  padding:
    var(--sum-inset-top)
    var(--sum-inset-right)
    var(--sum-inset-bottom)
    var(--sum-inset-left);
  max-width: 720px;
  margin: 0 auto;

  &--full-height {
    height: 100%;
  }

  &--no-scrollbar {
    @include mixins.noScrollbar;
    overflow: auto;
  }
}
</style>
