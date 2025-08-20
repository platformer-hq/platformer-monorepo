<script setup lang="ts">
import { onMainButtonClick, setMainButtonParams } from '@telegram-apps/sdk-vue';
import { ValiError } from 'valibot';
import { onWatcherCleanup, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

import type { ApiError } from '@/api/errors.js';
import ServerErrorStatusPage from '@/components/ServerErrorStatusPage.vue';
import StatusPage from '@/components/StatusPage.vue';

export type ErrorStatusPageError =
  | { type: 'unknown'; cause: unknown }
  | { type: 'server'; cause: Error | InstanceType<typeof ApiError> }
  | { type: 'init'; timeout: number }
  | { type: 'iframe'; timeout?: boolean }
  | { type: 'init-data-missing' }
  | { type: 'config-invalid'; cause: ValiError<any> };

const { onRetry } = defineProps<{
  error: ErrorStatusPageError;
  onRetry?(): void;
}>();
const emit = defineEmits<{ retry: [] }>();

const { t } = useI18n({
  messages: {
    en: {
      apiTimeoutMessage: 'Couldn\'t get information about the app (timed out {time}ms)',
      appUnknownMessage: 'An unknown error occurred while loading the application',
      configInvalidTitle: 'Incorrect configuration',
      defaultMessage: 'Unknown error occurred{error}',
      defaultTitle: 'Something went wrong',
      initDataMissingMessage: 'It is the most likely that the application was launched improperly',
      initDataMissingTitle: 'Init data is missing',
      loadTimeoutMessage: 'The app took too long to load',
      tryAgain: 'Try again',
    },
    ru: {
      apiTimeoutMessage: 'Не удалось получить информацию о приложении (тайм-аут {time}мс)',
      appUnknownMessage: 'Произошла неизвестная ошибка при загрузке приложения',
      configInvalidTitle: 'Некорректная настройка',
      defaultMessage: 'Произошла неизвестная ошибка{error}',
      defaultTitle: 'Что-то пошло не так',
      initDataMissingMessage: 'Скорее всего приложение было запущено некорректно',
      initDataMissingTitle: 'Данные инициализации отсутствуют',
      loadTimeoutMessage: 'Загрузка приложения оказалась слишком долгой',
      tryAgain: 'Попробовать снова',
    },
  },
});

watchEffect(() => {
  if (!onRetry) {
    return setMainButtonParams({ isVisible: false });
  }
  setMainButtonParams({ isVisible: true, text: t('tryAgain') });
  onWatcherCleanup(onMainButtonClick(() => {
    emit('retry');
  }));
  onWatcherCleanup(() => {
    setMainButtonParams({ isVisible: false });
  });
});
</script>

<template>
  <ServerErrorStatusPage
    v-if="error.type === 'server'"
    :error="error.cause"
  />
  <StatusPage
    v-else
    state="error"
    :title="t(({
      'config-invalid': 'configInvalidTitle',
      'init-data-missing': 'initDataMissingTitle'
    } as Partial<Record<ErrorStatusPageError['type'], string>>)[error.type] || 'defaultTitle')"
  >
    {{
      error.type === 'config-invalid'
        ? error.cause.message
        : error.type === 'init'
          ? t('apiTimeoutMessage', { time: error.timeout })
          : error.type === 'iframe'
            ? t(error.timeout ? 'loadTimeoutMessage' : 'appUnknownMessage')
            : error.type === 'init-data-missing'
              ? t('initDataMissingMessage')
              : t('defaultMessage', {
                error: error.cause instanceof Error
                  ? `: ${error.cause.message}`
                  : ''
              })
    }}
  </StatusPage>
</template>
