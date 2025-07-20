<script setup lang="ts">
import { onMainButtonClick, setMainButtonParams } from '@telegram-apps/sdk-vue';
import { ValiError } from 'valibot';
import { onWatcherCleanup, useAttrs, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import type { GraphQLError } from 'vue-swr-gql';

import ServerErrorStatusPage from '@/components/ServerErrorStatusPage.vue';
import StatusPage from '@/components/StatusPage.vue';

export type ErrorStatusPageError =
  | { type: 'unknown'; cause: unknown }
  | { type: 'server'; cause: Error | GraphQLError }
  | { type: 'init'; timeout: number }
  | { type: 'iframe'; timeout?: boolean }
  | { type: 'init-data-missing' }
  | { type: 'config-invalid'; cause: ValiError<any> };

const { onRetry } = useAttrs();
defineProps<{ error: ErrorStatusPageError }>();
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
const defaultTitle = t('defaultTitle');

watchEffect(() => {
  if (!onRetry) {
    return setMainButtonParams({ isVisible: false });
  }
  setMainButtonParams({ isVisible: true, text: t('tryAgain') });
  onWatcherCleanup(onMainButtonClick(() => {
    emit('retry');
  }));
});
</script>

<template>
  <StatusPage
    v-if="error.type === 'config-invalid'"
    state="error"
    :title="t('configInvalidTitle')"
  >
    {{ error.cause.message }}
  </StatusPage>

  <StatusPage
    v-else-if="error.type === 'init-data-missing'"
    state="error"
    :title="t('initDataMissingTitle')"
  >
    {{ t('initDataMissingMessage') }}
  </StatusPage>

  <ServerErrorStatusPage
    v-else-if="error.type === 'server'"
    :error="error.cause"
  />

  <StatusPage
    v-else-if="error.type === 'init'"
    state="error"
    :title="defaultTitle"
  >
    {{ t('apiTimeoutMessage', { time: error.timeout }) }}
  </StatusPage>

  <StatusPage
    v-else-if="error.type === 'iframe'"
    state="error"
    :title="defaultTitle"
  >
    {{ t(error.timeout ? 'loadTimeoutMessage' : 'appUnknownMessage') }}
  </StatusPage>

  <StatusPage
    v-else-if="error.type === 'unknown'"
    state="error"
    :title="defaultTitle"
  >
    {{
      t('defaultMessage', {
        error: error.cause instanceof Error
          ? `: ${error.cause.message}`
          : ''
      })
    }}
  </StatusPage>
</template>
