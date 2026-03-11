<script setup lang="ts">
defineProps<{ show?: boolean }>();

const { b, e } = bem('app-urls-page-http-warning');

const { t } = useI18n({
  messages: {
    en: {
      title: 'HTTP URL specified',
      text: 'HTTP links work with a limited number of clients. Use them only during development',
    },
    ru: {
      title: 'Указана HTTP-ссылка',
      text: 'HTTP-ссылки работают в ограниченном количестве клиентов Telegram. Используйте их только в целях разработки',
    },
  },
});
const transition = createReversibleTransition({
  animatedProperties: {
    opacity: [0, 1],
    transform: ['scale(0.98)', 'scale(1)'],
  },
  animationOptions: {
    duration: 300,
    easing: 'ease-out',
  },
});
</script>

<template>
  <Transition v-bind="transition" :css="false">
    <AutoRoundedPanel v-if="show" :class="b()">
      <AutoTypography :class="e('title')" variant="body" weight="semibold">
        <IconExclamationMarkTriangleFill28 :class="e('icon')" :size="20"/>
        {{ t('title') }}
      </AutoTypography>
      <AutoTypography>
        {{ t('text') }}
      </AutoTypography>
    </AutoRoundedPanel>
  </Transition>
</template>

<style lang="scss">
.app-urls-page-http-warning {
  margin-top: 16px;
  background-color: #ff9d0a64;
  padding: 15px 16px;

  &__title {
    margin-bottom: 6px;
  }

  &__icon {
    vertical-align: middle;
    color: #ff9d0a;
  }
}
</style>
