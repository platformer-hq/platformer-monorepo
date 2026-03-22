<script setup lang="ts">
import { openTelegramLink } from '@tma.js/sdk-vue';

import { Translation } from '#i18n';

const { b, e } = bem('project-disclaimer');
const link = 'https://t.me/platformer_hq';
const { t } = useI18n({
  messages: {
    en: { base: 'Works on {project}', project: 'Platformer' },
    ru: { base: 'Работает на {project}', project: 'Платформере' },
  },
});
</script>

<template>
  <VTypography :class="b()" variant="footnote">
    <Translation keypath="base">
      <template #project>
        <a :class="e('link')" :href="link" @click.prevent="openTelegramLink(link)">
          {{ t('project') }}
        </a>
      </template>
    </Translation>
  </VTypography>
</template>

<style lang="scss">
.project-disclaimer {
  color: var(--hint-color);

  &__link {
    text-decoration: none;
    color: var(--link-color);
  }
}
</style>
