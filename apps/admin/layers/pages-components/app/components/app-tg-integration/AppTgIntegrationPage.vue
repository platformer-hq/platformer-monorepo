<script setup lang="ts">
import * as fp from 'fp-ts';

import { Translation } from '#i18n';

import { AppTgIntegrationPageDataDocument, UpdateAppTelegramDataDocument } from './operations';

const { t } = useI18n({
  messages: {
    en: {
      apply: 'Apply changes',
      'botId.title': 'Telegram Bot ID',
      'botId.placeholder': 'Telegram Bot ID identifier',
      'botId.footer': 'Having a mini application based on Telegram Mini Apps, you should set this value equal to the bound Telegram Bot identifier. Otherwise, Platformer will not be able to display your application due to inability to verify init data, sent to your mini app using init data {link}.',
    },
    ru: {
      apply: 'Применить изменения',
      'botId.title': 'Telegram Bot ID',
      'botId.placeholder': 'Идентификатор Telegram Bot ID',
      'botId.footer': 'Имея мини-приложения в Telegram Mini Apps, здесь необходимо установить идентификатор связанного бота Telegram. В противном случае, Платформер не сможет отобразить Ваше приложение ввиду невозможности проверить данные инициализации используя, {link}.',
    },
  },
});
const isPageEntered = useIsCurrentPageEntered();
const appId = useQueryAppId();
const queryCache = useQueryCache();
const request = useMakeApiGqlRequest();
const { data } = useQuery({
  key: () => [AppTgIntegrationPageDataDocument, appId.value],
  query: throwify(() => {
    return fp.function.pipe(
      request(AppTgIntegrationPageDataDocument, { appId: appId.value }),
      fp.taskEither.map(({ app }) => (
        app
          ? { role: apiAppRoleToLocal(app.currentUserRole), botId: app.telegramBotID || undefined }
          : null
      )),
    );
  }),
});
const { mutate: updateApp, isLoading: isUpdatingApp } = useMutation({
  key: [UpdateAppTelegramDataDocument],
  mutation(options: { appId: number; botId?: number }) {
    return throwifyAnyEither(
      request(UpdateAppTelegramDataDocument, {
        appId: options.appId,
        telegramBotID: options.botId,
      }),
    );
  },
  onSuccess({ updateApp: { telegramBotID } }) {
    hapticNotificationOccurred('success');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryCache.setQueryData([AppTgIntegrationPageDataDocument, appId.value], (data: any) => (
      data
        ? { ...data, botId: telegramBotID || undefined }
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

const botId = ref(initialBotId.value);

const isDirty = computed(() => botId.value !== initialBotId.value);

watch(data, data => {
  if (data) {
    botId.value = data.botId?.toString() || '';
  }
});
</script>

<template>
  <PageRoot colors="secondary-bg">
    <PageContent>
      <PagePaddings>
        <AutoSection list-bg-color="section-bg">
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
                  <TextShimmerBox :width="160"/>
                </AutoListItemBodyLeftLabel>
              </template>
            </AutoListItem>
          </AutoList>
          <template #footer>
            <AutoSectionFooter>
              <Translation keypath="botId.footer">
                <template #link>
                  <ExternalLink href="https://docs.telegram-mini-apps.com/platform/init-data#using-telegram-public-key">
                    Third Party Validation
                  </ExternalLink>
                </template>
              </Translation>
            </AutoSectionFooter>
          </template>
        </AutoSection>
      </PagePaddings>
    </PageContent>
    <template #bottomBar>
      <BottomBarTransition>
        <BottomBar v-if="isPageEntered && isDirty">
          <BottomBarInner>
            <AutoButton
              :palette="isUpdatingApp ? 'disabled' : 'filled'"
              full-width
              :disabled="isUpdatingApp"
              :active="!isUpdatingApp"
              @click="updateApp({appId, botId: parseInt(botId) || undefined})"
            >
              <AutoTypography variant="body" weight="semibold">
                {{ t('apply') }}
              </AutoTypography>
              <ButtonLoadingIndicator :show="isUpdatingApp"/>
            </AutoButton>
          </BottomBarInner>
        </BottomBar>
      </BottomBarTransition>
    </template>
  </PageRoot>
</template>
