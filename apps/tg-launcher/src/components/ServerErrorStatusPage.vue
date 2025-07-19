<script setup lang="ts">
import { is, looseObject, string } from 'valibot';
import { useI18n } from 'vue-i18n';
import { GraphQLError } from 'vue-swr-gql';

import StatusPage from './StatusPage.vue';
import Text from './Text.vue';

const { error } = defineProps<{
  error: Error | GraphQLError;
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

let code: string | undefined;
if (GraphQLError.is(error)) {
  const { extensions } = error.response;
  if (is(looseObject({ errorData: looseObject({ code: string() }) }), extensions)) {
    code = extensions.errorData.code;
  }
}
</script>

<template>
  <StatusPage
    :title="t('title')"
    state="error"
  >
    <template v-if="GraphQLError.is(error)">
      {{ t('apiMessage', { error: error.message }) }}
      <template v-if="code">
        &nbsp;
        <Text
          as="span"
          weight="semibold"
        >
          ({{ code }})
        </Text>
      </template>
    </template>
    <template v-else>
      {{ t('requestMessage', { error: error.message }) }}
    </template>
  </StatusPage>
</template>
