<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { function as fn, taskEither } from 'fp-ts';

import { AppTgIntegrationPageDataDocument, UpdateAppTelegramDataDocument } from './operations';

const { t } = useI18n({
  messages: {
    en: {
      apply: 'Apply changes',
      'botId.title': 'Telegram Bot ID',
      'botId.placeholder': 'Telegram Bot ID identifier',
      'botId.footer': 'Having a mini application based on Telegram Mini Apps, you should set this value equal to the bound Telegram Bot identifier. Otherwise, Platformer will not be able to display your application due to inability to verify init data, sent to your mini app using init data Third Party Validation.',
      'proxy.title': 'Proxy launch parameters',
      'proxy.footer': 'Enabling this option, the Platformer\'s launcher will append all Telegram Mini Apps launch parameters to the URL. In turn, it allows you yo use Server-Side Rendering (SSR).',
    },
    ru: {
      apply: 'Применить изменения',
      'botId.title': 'Telegram Bot ID',
      'botId.placeholder': 'Идентификатор Telegram Bot ID',
      'botId.footer': 'Имея мини-приложения в Telegram Mini Apps, здесь необходимо установить идентификатор связанного бота Telegram. В противном случае, Платформер не сможет отобразить Ваше приложение ввиду невозможности проверить данные инициализации используя Third Party Validation.',
      'proxy.title': 'Проксировать параметры запуска',
      'proxy.footer': 'Включение этой опции приведет к добавлению лаунчером Платформера параметров запуска Telegram Mini Apps к ссылке на приложение. В свою очередь, на Вашей стороне это позволяет использовать Server-Side Rendering (SSR).',
    },
  },
});
const isPageEntered = useIsCurrentPageEntered();
const platform = useTmaPlatform();
const appId = useQueryAppId();
const queryClient = useQueryClient();
const request = useMakeGqlApiRequest();
const { data } = useQuery({
  queryKey: [AppTgIntegrationPageDataDocument, appId] as const,
  queryFn: throwify(
    ({ queryKey}: { queryKey: readonly [typeof AppTgIntegrationPageDataDocument, number] }) => {
      return fn.pipe(
        request({ document: queryKey[0], variables: { appId: queryKey[1] } }),
        taskEither.map(({ app }) => (
          app
            ? {
              role: apiAppRoleToLocal(app.currentUserRole),
              botId: app.telegramBotID || undefined,
              proxy: app.telegramProxyLaunchParams,
            }
            : null
        )),
      );
    },
  ),
});
const mutationFn = throwify((options: {
  appId: number;
  botId?: number;
  proxy: boolean;
}) => {
  return request({
    document: UpdateAppTelegramDataDocument,
    variables: {
      appId: options.appId,
      telegramProxyLaunchParams: options.proxy,
      telegramBotID: options.botId,
    },
  });
});
const { mutate: updateApp, isPending: isUpdatingApp } = useMutation({
  mutationKey: [UpdateAppTelegramDataDocument],
  mutationFn,
  onSuccess({ updateApp: { telegramProxyLaunchParams, telegramBotID } }) {
    hapticNotificationOccurred('success');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryClient.setQueryData([AppTgIntegrationPageDataDocument, appId], (data: any) => (
      data
        ? {
          ...data,
          botId: telegramBotID || undefined,
          proxy: telegramProxyLaunchParams ?? undefined,
        }
        : data
    ));
  },
  onError() {
    // TODO: popup.
    hapticNotificationOccurred('error');
  },
});

const readonly = computed(() => data.value?.role === 'member');
const initialBotId = computed(() => (data.value?.botId?.toString() || ''));
const initialProxy = computed(() => data.value?.proxy || false);

const botId = ref(initialBotId.value);
const proxy = ref(initialProxy.value);

const isDirty = computed(() => {
  return botId.value !== initialBotId.value || proxy.value !== initialProxy.value;
});

watch(data, data => {
  if (data) {
    botId.value = data.botId?.toString() || '';
    proxy.value = data.proxy;
  }
});
</script>

<template>
  <PageBase>
    <PageContent>
      <PagePaddings>
        <AutoSection list-bg-color="secondary-bg">
          <template #header>
            <AutoSectionHeader>
              {{ t('botId.title') }}
            </AutoSectionHeader>
          </template>
          <AutoList>
            <AutoListItem>
              <template v-if="data" #bodyLeftInput>
                <AutoListItemBodyLeftInput>
                  <AutoListItemBodyLeftInputElement
                    v-model="botId"
                    type="number"
                    min="1"
                    :disabled="isUpdatingApp || readonly"
                    :placeholder="t('botId.placeholder')"
                  />
                </AutoListItemBodyLeftInput>
              </template>
              <template v-else #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  <TextShimmerBox variant="body" :width="160"/>
                </AutoListItemBodyLeftLabel>
              </template>
            </AutoListItem>
          </AutoList>
          <template #footer>
            <AutoSectionFooter>
              {{ t('botId.footer') }}
            </AutoSectionFooter>
          </template>
        </AutoSection>

        <AutoSection list-bg-color="secondary-bg" :style="{marginTop: '16px'}">
          <AutoList>
            <AutoListItem
              :clickable="platform.isMappedAndroid && !readonly"
              @click="platform.isMappedAndroid && !readonly && (proxy = !proxy)"
            >
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel :max-lines="1">
                  {{ t('proxy.title') }}
                </AutoListItemBodyLeftLabel>
              </template>
              <template #bodyRight>
                <AutoListItemBodyRight>
                  <AutoSwitch
                    v-model:checked="proxy"
                    :disabled="!data || isUpdatingApp || readonly"
                    @click.stop
                  />
                </AutoListItemBodyRight>
              </template>
            </AutoListItem>
          </AutoList>
          <template #footer>
            <AutoSectionFooter>
              {{ t('proxy.footer') }}
            </AutoSectionFooter>
          </template>
        </AutoSection>
      </PagePaddings>
    </PageContent>
    <BottomBarTransition>
      <BottomBar v-if="isPageEntered && isDirty">
        <BottomBarInner>
          <AutoButton
            :palette="isUpdatingApp ? 'disabled' : 'filled'"
            full-width
            :disabled="isUpdatingApp"
            :active="!isUpdatingApp"
            @click="updateApp({appId, botId: parseInt(botId) || undefined, proxy})"
          >
            <AutoTypography variant="body" weight="semibold">
              {{ t('apply') }}
            </AutoTypography>
            <ButtonLoadingIndicator :show="isUpdatingApp"/>
          </AutoButton>
        </BottomBarInner>
      </BottomBar>
    </BottomBarTransition>
  </PageBase>
</template>
