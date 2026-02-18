<script setup lang="ts">
import { onMainButtonClick, setMainButtonParams } from '@telegram-apps/sdk-vue';
import { computed, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

import AppFrame, { type AppFrameEmits, type AppFrameProps } from './AppFrame.vue';
import StatusPage from './StatusPage.vue';

const props = defineProps<AppFrameProps>();
const emit = defineEmits<AppFrameEmits>();

const { t } = useI18n({
  messages: {
    en: {
      redirect: 'Redirect',
      redirecting: 'Redirecting',
      httpTitle: 'HTTP URL detected',
      httpText: 'Due to web restrictions, Platformer doesn\'t support HTTP links, but can redirect you to them.\n\nIn this case Platformer\'s functionality will be unavailable',
      httpErrorText: 'Due to web restrictions, Platformer doesn\'t support HTTP links in web clients. Try using an HTTPS link or a different client',
    },
    ru: {
      redirect: 'Перенаправить',
      redirecting: 'Перенаправляем',
      httpTitle: 'Обнаружена HTTP-ссылка',
      httpText: 'Платформер не поддерживает HTTP-ссылки из-за веб-ограничений, но может перенаправить Вас на них.\n\nВ этом случае функционал Платформера не будет доступен',
      httpErrorText: 'Из-за веб-ограничений, Платформер не поддерживает HTTP-ссылки в веб-клиентах. Попробуйте указать HTTPS-ссылку, или использовать другой клиент',
    },
  },
});
const isHttp = computed(() => props.url.startsWith('http:'));
let isWeb = true;
try {
  isWeb = window.self !== window.top;
} catch {
}

watchEffect(() => {
  if (isHttp.value && !isWeb) {
    setMainButtonParams({ text: t('redirect'), isVisible: true, isEnabled: true });
    onMainButtonClick(() => {
      setMainButtonParams({ text: t('redirecting'), isLoaderVisible: true, isEnabled: false });

      setTimeout(() => {
        window.location.href = props.url;
        setMainButtonParams({ isVisible: false });
      }, 1000);
    });
  }
});
</script>

<template>
  <StatusPage
    v-if="isHttp"
    :title="t('httpTitle')"
    :state="isWeb ? 'error' : 'warning'"
  >
    <span class="warningText">
      {{ t(isWeb ? 'httpErrorText' : 'httpText') }}
    </span>
  </StatusPage>
  <AppFrame
    v-else
    :load-timeout
    :url
    @error="emit('error', $event)"
    @ready="emit('ready')"
  />
</template>

<style scoped>
.warningText {
  white-space: break-spaces;
}
</style>
