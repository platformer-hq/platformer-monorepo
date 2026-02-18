<script setup lang="ts">
import Callout from '@/ui/components/Callout/Callout.vue';
import CalloutParagraph from '@/ui/components/Callout/CalloutParagraph.vue';
import { useI18n } from 'vue-i18n';
import { ExclamationMarkTriangleFill28 } from 'vue-ui';

const { t } = useI18n({
  messages: {
    en: {
      title: 'HTTP links limitations',
      message: 'Non-secured HTTP links (starting with the <i>http://</i> protocol) work with a limited number of clients. Use them only during development.',
    },
    ru: {
      title: 'Ограничения HTTP-ссылок',
      message: 'Небезопасные HTTP-ссылки (начинающиеся с протокола <i>http://</i>) работают в ограниченном количестве клиентов Telegram. Используйте их только в целях разработки.',
    },
  },
});
</script>

<template>
  <section>
    <Callout
      :icon="ExclamationMarkTriangleFill28"
      :title="t('title')"
      variant="warning"
    >
      <CalloutParagraph>
        <span v-html="t('message')" />
      </CalloutParagraph>
    </Callout>
  </section>
</template>
