<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { type ApiError, isApiError } from 'vue-swr-shared';

import StatusPage from './StatusPage.vue';
import Text from './Text.vue';

const { error } = defineProps<{
  error: Error | InstanceType<typeof ApiError>;
}>();

const { t } = useI18n({
  messages: {
    en: {
      apiMessage: 'Server returned error: {error}',
      title: 'Something went wrong',
      requestMessage: 'Sending request error: {error}',
    },
    ru: {
      apiMessage: 'Сервер вернул ошибку: {error}',
      title: 'Что-то пошло не так',
      requestMessage: 'Ошибка отправки запроса: {error}',
    },
  },
});
</script>

<template>
  <StatusPage
    :title="t('title')"
    state="error"
  >
    <template v-if="isApiError(error)">
      {{ t('apiMessage', { error: error.message }) }}
      <template v-if="error.data.code">
        &nbsp;
        <Text
          as="span"
          weight="semibold"
        >
          ({{ error.data.code }})
        </Text>
      </template>
    </template>
    <template v-else>
      {{ t('requestMessage', { error: error.message }) }}
    </template>
  </StatusPage>
</template>
