<script setup lang="ts">
import Callout from '@/ui/components/Callout/Callout.vue';
import CalloutParagraph from '@/ui/components/Callout/CalloutParagraph.vue';
import { useI18n } from 'vue-i18n';
import { InfoCircleFill24 } from 'vue-ui';

const { t } = useI18n({
  messages: {
    en: {
      title: 'How It Works',
      p1: 'Certain applications are designed to work only on specific platforms. For instance, an app may function only on mobile devices due to hardware or interface constraints.',
      p2: 'Platformer enables developers to assign distinct URLs for different platforms. If no URL is set for a particular platform, Platformer automatically displays a placeholder to inform users that the app cannot run on their current device.',
    },
    ru: {
      title: 'Как это работает?',
      p1: 'Некоторые приложения призваны работать только на конкретных платформах. Например, приложение может функционировать только на мобильных устройствах ввиду наличия технических или интерфейсных ограничений.',
      p2: 'Платформер позволяет разработчикам установить отдельные ссылки под разные клиенты Telegram. Если под конкретный клиент ссылка не была установлена, Платформер автоматически отображает заглушку, информирующую пользователя о том, что приложение недоступно на их устройстве.',
    },
  },
});
</script>

<template>
  <section>
    <Callout
      :icon="InfoCircleFill24"
      :title="t('title')"
    >
      <CalloutParagraph>{{ t('p1') }}</CalloutParagraph>
      <CalloutParagraph>{{ t('p2') }}</CalloutParagraph>
    </Callout>
  </section>
</template>
