<script lang="ts">
import type * as Types from 'api';

import { gql, type TypedDocumentNode } from 'vue-swr-gql-shared';
type GetAppUrlQueryVariables = Types.Exact<{
  appID: Types.Scalars['ID']['input'];
  launchParams: Types.Scalars['String']['input'];
}>;

export type GetAppUrlQuery = { __typename?: 'Query'; appTelegramURL?: string | null };

export const GetAppUrl = gql`
    query GetAppURL($appID: ID!, $launchParams: String!) {
  appTelegramURL(appID: $appID, launchParams: $launchParams)
}
    ` as unknown as TypedDocumentNode<GetAppUrlQuery, GetAppUrlQueryVariables>;
</script>

<script setup lang="ts">
import { isTimeoutError } from 'better-promises';
import { onUnmounted, ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { GraphQLError, useGqlQuery } from 'vue-swr-gql-shared';

import AppFrameBootstrapper from '@/components/AppFrameBootstrapper.vue';
import type { ErrorStatusPageError } from '@/components/ErrorStatusPage.vue';
import StatusPage from '@/components/StatusPage.vue';
import { appendRawLaunchParams } from '@/helpers/appendRawLaunchParams.js';

interface ErrorEvent {
  error: ErrorStatusPageError;
  fallbackUrl?: string;
}

const { fallbackUrl, appId, securedRawLaunchParams, initTimeout, loadTimeout } = defineProps<{
  appId: number;
  fallbackUrl?: string | null;
  initTimeout: number;
  loadTimeout: number;
  rawLaunchParams: string;
  securedRawLaunchParams: string;
}>();
const emit = defineEmits<{
  appDataRetrieved: [];
  error: [ErrorEvent];
  ready: [{ fallbackUrl?: string }];
}>();

const { t } = useI18n({
  messages: {
    en: {
      notFoundTitle: 'App not found',
      notFoundText: 'This application was not found',
      noAccessTitle: 'Nothing here',
      noAccessText: 'The application is inaccessible on your device',
    },
    ru: {
      notFoundTitle: 'Приложение не найдено',
      notFoundText: 'Это приложение не было найдено',
      noAccessTitle: 'Тут пусто',
      noAccessText: 'Приложение недоступно на Вашем устройстве',
    },
  },
});
const error = ref<ErrorStatusPageError>();
const appData = shallowRef<{ found: boolean; url?: string | null }>();

const controller = new AbortController();
const { signal } = controller;
const timeoutId = setTimeout(() => {
  controller.abort();
}, loadTimeout);
onUnmounted(() => {
  clearTimeout(timeoutId);
});

useGqlQuery(
  GetAppUrl,
  [{ appID: appId, launchParams: securedRawLaunchParams }, { signal }],
  {
    freshAge: 0,
    onSuccess({ data }) {
      appData.value = { found: true, url: data.appTelegramURL };
      emit('appDataRetrieved');
    },
    onError({ error: err }) {
      if (GraphQLError.is(err)) {
        if (err.isOfType('ERR_APP_NOT_FOUND')) {
          appData.value = { found: false };
        } else {
          error.value = { type: 'server', cause: err };
        }
        return;
      }
      error.value = isTimeoutError(error)
        ? { type: 'init', timeout: initTimeout }
        : { type: 'unknown', cause: error };
    },
    shouldRetry(error) {
      return (
        !isTimeoutError(error)
        && !(GraphQLError.is(error) && error.isOfType('ERR_APP_NOT_FOUND'))
      );
    },
    staleAge: 0,
  },
);
</script>

<template>
  <template v-if="error">
    <AppFrameBootstrapper
      v-if="fallbackUrl"
      :load-timeout="loadTimeout"
      :url="appendRawLaunchParams(fallbackUrl, rawLaunchParams)"
      @error="$emit('error', { error, fallbackUrl })"
      @ready="$emit('ready', { fallbackUrl })"
    />
    <template v-else>
      @mounted="$emit('error', { error })"
    </template>
  </template>
  <template v-else-if="appData">
    <AppFrameBootstrapper
      v-if="appData.url"
      :load-timeout="loadTimeout"
      :url="appendRawLaunchParams(appData.url, rawLaunchParams)"
      @error="error = { type: 'iframe', timeout: $event.timeout}"
      @ready="$emit('ready', {})"
    />
    <template v-else>
      @mounted="$emit('ready', {})"
      <StatusPage
        :text="t(appData.found ? 'noAccessText' : 'notFoundText')"
        :title="t(appData.found ? 'noAccessTitle' : 'notFoundTitle')"
      />
    </template>
  </template>
</template>
