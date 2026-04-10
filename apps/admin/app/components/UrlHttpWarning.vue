<script setup lang="ts">
import { IconExclamationMarkTriangleFill28 } from '@workspace/ui-kit';

const { b, e } = bem('url-http-warning');

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
</script>

<template>
  <AutoRoundedPanel :class="b()">
    <AutoTypography :class="e('title')" variant="body" weight="semibold">
      <IconExclamationMarkTriangleFill28 :class="e('icon')" :size="20"/>
      {{ t('title') }}
    </AutoTypography>
    <AutoTypography>
      {{ t('text') }}
    </AutoTypography>
  </AutoRoundedPanel>
</template>

<style lang="scss">
.url-http-warning {
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
