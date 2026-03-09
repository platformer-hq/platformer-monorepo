<script setup lang="ts">
import { useMutation, useQuery, useQueryCache } from '@pinia/colada';
import { popup } from '@tma.js/sdk-vue';
import * as fp from 'fp-ts';
import * as v from 'valibot';

import { AppCachePageDataDocument, ResetAppCacheDocument } from './operations';

const query = v.parse(
  v.looseObject({ appId: v.pipe(v.string(), v.transform(Number)) }),
  useRoute().query,
);

const { t, locale } = useI18n({
  messages: {
    en: {
      'reset.button': 'Reset URL cache',
      'reset.footer': 'Resetting the cache will update the app URLs by appending a special query parameter, forcing Telegram clients to load the latest assets from your URLs',
      'date.title': 'Cache reset date',
      'date.value.never': 'never',
      'popup.title': 'Confirm cache reset',
      'popup.message': 'Are you sure you want to reset the application cache?',
      'popup.cancel': 'Cancel',
      'popup.confirm': 'Reset cache',
    },
    ru: {
      'reset.button': 'Сбросить кеш',
      'reset.footer': 'Сброс кеша приведет к обновлению ссылок на приложение при помощи добавления специального query-параметра, вынуждающего клиент Telegram загрузить самое актуальное состояние по указанным ссылкам',
      'date.title': 'Дата сброса кеша',
      'date.value.never': 'Никогда',
      'popup.title': 'Подтвердите сброс кеша',
      'popup.message': 'Вы уверены, что хотите сбросить кеш приложения?',
      'popup.cancel': 'Отмена',
      'popup.confirm': 'Сбросить кеш',
    },
  },
});
const request = useMakeGqlApiRequest();
const queryCache = useQueryCache();
const { data: appData, isPending: isLoadingApp } = useQuery({
  key: () => [AppCachePageDataDocument, query.appId],
  query: throwify(() => {
    return fp.function.pipe(
      request(AppCachePageDataDocument, { appID: query.appId }),
      fp.taskEither.map(({ app }) => (
        app
          ? { urlsCacheResetAt: app.urlsCacheResetAt ? new Date(app.urlsCacheResetAt) : undefined }
          : null
      )),
    );
  }),
});
const { mutate: resetCache, isLoading: isResettingCache } = useMutation({
  key: [ResetAppCacheDocument],
  mutation(options: { appId: number }) {
    return throwifyAnyEither(request(ResetAppCacheDocument, { appID: options.appId }));
  },
  onSuccess({ updateApp: { urlsCacheResetAt } }) {
    hapticNotificationOccurred('success');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryCache.setQueryData([AppCachePageDataDocument, query.appId], (data: any) => (
      data
        ? { ...data, urlsCacheResetAt: urlsCacheResetAt ? new Date(urlsCacheResetAt) : undefined }
        : data
    ));
  },
  onError() {
    hapticNotificationOccurred('error');
    // TODO: Popup.
  },
});

const isSendingRequest = computed(() => isLoadingApp.value || isResettingCache.value);

const handleReset = async () => {
  const response = await popup.show({
    title: t('popup.title'),
    message: t('popup.message'),
    buttons: [
      { id: 'no', type: 'default', text: t('popup.cancel') },
      { id: 'yes', type: 'default', text: t('popup.confirm') },
    ],
  });
  if (response === 'yes') {
    resetCache({ appId: query.appId });
  }
};

onMounted(() => {
  preloadRouteComponents({ name: PAGE_NAME_APP });
});
</script>

<template>
  <PageRoot colors="secondary-bg">
    <PageContent>
      <PagePaddings>
        <AutoSection list-bg-color="section-bg">
          <AutoList>
            <AutoListItem
              :variant="isSendingRequest ? 'placeholder' : 'accent'"
              :clickable="!isSendingRequest"
              @click="!isSendingRequest && handleReset()"
            >
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  {{ t('reset.button') }}
                </AutoListItemBodyLeftLabel>
              </template>
            </AutoListItem>
            <AutoListItem large>
              <template #bodyLeft>
                <AutoListItemBodyLeft reversed>
                  <template #subtitle>
                    <AutoListItemBodyLeftSubtitle>
                      {{ t('date.title') }}
                    </AutoListItemBodyLeftSubtitle>
                  </template>
                  <template #label>
                    <AutoListItemBodyLeftLabel>
                      <template v-if="appData">
                        {{ appData?.urlsCacheResetAt?.toLocaleString(locale, {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          second: 'numeric',
                          weekday: 'short'
                        }) || t('date.value.never') }}
                      </template>
                      <TextShimmerBox v-else variant="body" :width="90"/>
                    </AutoListItemBodyLeftLabel>
                  </template>
                </AutoListItemBodyLeft>
              </template>
            </AutoListItem>
          </AutoList>
          <template #footer>
            <AutoSectionFooter>
              {{ t('reset.footer') }}
            </AutoSectionFooter>
          </template>
        </AutoSection>
      </PagePaddings>
    </PageContent>
  </PageRoot>
</template>
