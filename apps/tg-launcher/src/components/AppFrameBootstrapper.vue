<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

import AppFrame, { type AppFrameEmits, type AppFrameProps } from '@/components/AppFrame.vue';
import { onMainButtonClick, setMainButtonParams } from '@telegram-apps/sdk-vue';
import StatusPage from './StatusPage.vue';

const props = defineProps<AppFrameProps>();
const emit = defineEmits<AppFrameEmits>();

const { t } = useI18n({
  messages: {
    en: {
      redirect: 'Redirect',
      redirecting: 'Redirecting',
      httpTitle: 'HTTP URL detected',
      httpText: 'Due to web restrictions, Platformer doesn\'t support HTTP links, but can redirect you to them. In this case Platformer\'s functionality will be unavailable',
    },
    ru: {
      redirect: 'Перенаправить',
      redirecting: 'Перенаправляем',
      httpTitle: 'Обнаружена HTTP-ссылка',
      httpText: 'Платформер не поддерживает HTTP-ссылки из-за веб-ограничений, но может перенаправить Вас на них. \n\nВ этом случае функционал Платформера не будет доступен',
    },
  },
});
const isHttp = computed(() => props.url.startsWith('http:'));

watchEffect(() => {
  if (isHttp.value) {
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
    state="warning"
  >
    <span class="warningText">
      {{ t('httpText') }}
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
