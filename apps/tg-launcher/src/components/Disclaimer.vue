<script setup lang="ts">
import { openTelegramLink } from '@telegram-apps/sdk-vue';
import { useI18n } from 'vue-i18n';
import { bem } from 'utils';

import Text from '@/components/Text.vue';

const [b, e] = bem('disclaimer');
const link = 'https://t.me/platformer_hq';
const { t } = useI18n({
  messages: {
    en: { prefix: 'Works on', suffix: 'Platformer' },
    ru: { prefix: 'Работает на', suffix: 'Платформере' },
  },
});
</script>

<template>
  <Text :class="b()" variant="footnote">
    {{ t('prefix') }}
    <a :class="e('link')" :href="link" @click.prevent="openTelegramLink(link)">
      {{ t('suffix') }}
    </a>
  </Text>
</template>

<style lang="scss">
.disclaimer {
  color: var(--theme-hint-color);

  &__link {
    text-decoration: none;
    color: var(--theme-accent-text-color);
  }
}
</style>