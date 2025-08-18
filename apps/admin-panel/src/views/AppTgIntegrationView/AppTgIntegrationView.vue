<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { onMainButtonClick, setMainButtonParams } from '@telegram-apps/sdk-vue';
import { computed, onWatcherCleanup, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

import { useAppIDFromParams } from '@/navigation/useAppIDFromParams';
import { useMutationFn } from '@/queries/useMutationFn';
import { isEditorAppRole } from '@/roles/isEditorAppRole';
import List from '@/ui/adapters/List.js';
import ListItem from '@/ui/adapters/ListItem.js';
import ListItemBodyInput from '@/ui/adapters/ListItemBodyInput';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel.js';
import ListItemBodyRightSwitch from '@/ui/adapters/ListItemBodyRightSwitch';
import Page from '@/ui/components/Page.vue';
import PageLoading from '@/ui/components/PageLoading.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';
import AppNotFoundView from '@/views/AppNotFoundView/AppNotFoundView.vue';

import {
  UpdateAppTelegramData,
  type UpdateAppTelegramDataMutation,
  type UpdateAppTelegramDataMutationVariables,
} from './operations';
import {
  setAppTgIntegrationViewQueryData,
  useAppTgIntegrationViewQueryOptions,
} from './query-options';

const { t } = useI18n({
  messages: {
    en: {
      mbApplyChanges: 'Apply changes',
      botIDTitle: 'Telegram Bot ID',
      botIDPlaceholder: 'Telegram Bot ID identifier',
      botIDFooter: 'Having a mini application based on Telegram Mini Apps, you should set this value equal to the bound Telegram Bot identifier. Otherwise, Platformer will not be able to display your application due to inability to verify init data, sent to your mini app using init data Third Party Validation.',
      proxyLP: 'Proxy launch parameters',
      proxyLPFooter: 'Enabling this option, the Platformer\'s launcher will append all Telegram Mini Apps launch parameters to the URL. In turn, it allows you yo use Server-Side Rendering (SSR).',
    },
    ru: {
      mbApplyChanges: 'Применить изменения',
      botIDTitle: 'Telegram Bot ID',
      botIDPlaceholder: 'Идентификатор Telegram Bot ID',
      botIDFooter: 'Имея мини-приложения в Telegram Mini Apps, здесь необходимо установить идентификатор связанного бота Telegram. В противном случае, Платформер не сможет отобразить Ваше приложение ввиду невозможности проверить данные инициализации используя Third Party Validation.',
      proxyLP: 'Проксировать параметры запуска',
      proxyLPFooter: 'Включение этой опции приведет к добавлению лаунчером Платформера параметров запуска Telegram Mini Apps к ссылке на приложение. В свою очередь, на Вашей стороне это позволяет использовать Server-Side Rendering (SSR).',
    },
  },
});

const client = useQueryClient();
const appID = useAppIDFromParams();
const {
  data: viewData,
  isPending: isViewDataPending,
} = useQuery(useAppTgIntegrationViewQueryOptions(appID));
const {
  mutate: updateSettings,
  isPending: isUpdatingSettings,
} = useMutation<
  UpdateAppTelegramDataMutation,
  unknown,
  UpdateAppTelegramDataMutationVariables
>({
  mutationFn: useMutationFn(UpdateAppTelegramData),
  onSuccess(response, vars) {
    setAppTgIntegrationViewQueryData([vars.appID], client, prev => {
      if (prev?.app) {
        prev.app = { ...prev.app, ...response.updateApp };
        return prev;
      }
    });
  },
});

const readonly = computed(() => {
  return !!viewData.value && !isEditorAppRole(viewData.value.currentUserRole);
});
const proxyLp = ref(viewData.value?.telegramProxyLaunchParams || false);
const botId = ref(viewData.value?.telegramBotID?.toString() || '');
const showMainButton = computed(() => {
  if (!viewData.value) {
    return false;
  }
  const { telegramProxyLaunchParams, telegramBotID } = viewData.value;
  const botIdNum = parseInt(botId.value);
  const isBotIdSpecified = !Number.isNaN(botIdNum);

  return (
    // Proxy launch parameters changed.
    proxyLp.value !== telegramProxyLaunchParams
    // Telegram Bot ID is and was specified, but the value changed.
    || (isBotIdSpecified && typeof telegramBotID === 'number' && botIdNum !== telegramBotID)
    // Telegram Bot ID was set or removed.
    || (isBotIdSpecified !== (typeof telegramBotID === 'number'))
  );
});

watchEffect(() => {
  if (viewData.value) {
    botId.value = viewData.value.telegramBotID?.toString() || '';
    proxyLp.value = viewData.value.telegramProxyLaunchParams;
  }
});

watchEffect(() => {
  if (showMainButton.value) {
    setMainButtonParams({
      isEnabled: !isUpdatingSettings.value,
      isLoaderVisible: isUpdatingSettings.value,
      isVisible: true,
      text: t('mbApplyChanges'),
    });
    onWatcherCleanup(onMainButtonClick(() => {
      const botIdNum = parseInt(botId.value);
      updateSettings({
        appID,
        telegramBotID: Number.isNaN(botIdNum) ? null : botIdNum,
        telegramProxyLaunchParams: proxyLp.value,
      });
    }));
  } else {
    setMainButtonParams({ isVisible: false });
  }
});
</script>

<template>
  <Page preserve-main-button>
    <PagePaddings>
      <PageLoading v-if="!viewData && isViewDataPending" />
      <AppNotFoundView v-else-if="!viewData" />
      <template v-else>
        <List
          :title="t('botIDTitle')"
          :footer="t('botIDFooter')"
        >
          <ListItem>
            <template #bodyInput>
              <ListItemBodyInput
                v-model:value="botId"
                type="number"
                :disabled="readonly"
                :placeholder="t('botIDPlaceholder')"
                min="1"
              />
            </template>
          </ListItem>
        </List>
        <List
          class="app-tg-integration-view__list"
          :footer="t('proxyLPFooter')"
        >
          <ListItem>
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>{{ t('proxyLP') }}</ListItemBodyLeftLabel>
            </template>
            <template #bodyRightSwitch>
              <ListItemBodyRightSwitch
                :checked="proxyLp"
                :disabled="readonly"
                @change="proxyLp = $event.target.checked"
              />
            </template>
          </ListItem>
        </List>
      </template>
    </PagePaddings>
  </Page>
</template>

<style>
.app-tg-integration-view__list {
  margin-top: 16px;
}
</style>
