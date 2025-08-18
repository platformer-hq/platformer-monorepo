<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  onMainButtonClick,
  onSecondaryButtonClick,
  setMainButtonParams,
  setSecondaryButtonParams,
  themeParamsDestructiveTextColor,
  themeParamsTextColor,
  useSignal,
} from '@telegram-apps/sdk-vue';
import { onWatcherCleanup, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { bem } from 'vue-ui';

import { useGqlRequest } from '@/queries/useGqlRequest.js';
import List from '@/ui/adapters/List.js';
import ListItem from '@/ui/adapters/ListItem.js';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel.js';
import ListItemBodyLeftSubtitle from '@/ui/adapters/ListItemBodyLeftSubtitle';
import ListItemBodyRightChevron from '@/ui/adapters/ListItemBodyRightChevron';
import ListItemLeftLabel from '@/ui/adapters/ListItemLeftLabel.js';
import Text from '@/ui/adapters/Text.vue';
import Page from '@/ui/components/Page.vue';
import PageLoading from '@/ui/components/PageLoading.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';
import { refetchAppsViewQuery } from '@/views/AppsView/query-options.js';
import { refetchHomeViewQuery } from '@/views/HomeView/query-options.js';

import {
  Respond,
  type RespondMutation,
  type RespondMutationVariables,
} from './operations.js';
import { setTransfersViewQueryData, useTransfersViewQueryOptions } from './query-options.js';

const [, e] = bem('transfers-view');

const router = useRouter();
const { t } = useI18n({
  messages: {
    en: {
      accept: 'Accept',
      decline: 'Decline',
      app: 'Application',
      sender: 'Sender',
      noTransfers: 'You have no app transfer requests',
      from: 'From {name}',
    },
    ru: {
      accept: 'Принять',
      decline: 'Отклонить',
      app: 'Приложение',
      sender: 'Отправитель',
      noTransfers: 'У Вас нет запросов на перенос приложений',
      from: 'От {name}',
    },
  },
});
const client = useQueryClient();
const request = useGqlRequest();
const { data: transfers } = useQuery(useTransfersViewQueryOptions());
const { isPending: isResponding, mutate: respondInvite } = useMutation<
  RespondMutation,
  unknown,
  RespondMutationVariables
>({
  mutationFn: variables => request(Respond, variables),
  onSuccess(_data, variables) {
    setTransfersViewQueryData(client, data => {
      if (!data) {
        return;
      }
      const { currentUser } = data;
      currentUser.appTransferRequests = currentUser
        .appTransferRequests
        .filter(item => item.id !== variables.requestID);
      return data;
    });
    refetchHomeViewQuery(client).catch(e => {
      console.log('Failed to revalidate main page data', e);
    });
    refetchAppsViewQuery(client).catch(e => {
      console.log('Failed to revalidate apps page data', e);
    });
    selectedRequest.value = undefined;
  },
});

const selectedRequest = ref<{
  id: number;
  from: { id: number; name: string };
  app: { id: number; title: string };
} | undefined>();
const themeTextColor = useSignal(themeParamsTextColor);
const themeDestructiveTextColor = useSignal(themeParamsDestructiveTextColor);

watchEffect(() => {
  const { value: requestValue } = selectedRequest;
  if (!requestValue) {
    setSecondaryButtonParams({ isVisible: false });
    setMainButtonParams({ isVisible: false });
    return;
  }
  const shared = {
    isVisible: true,
    isEnabled: !isResponding.value,
    isLoaderVisible: isResponding.value,
  };
  setMainButtonParams({ ...shared, text: t('accept') });
  setSecondaryButtonParams({
    ...shared,
    textColor: themeTextColor.value,
    backgroundColor: themeDestructiveTextColor.value,
    text: t('decline'),
  });

  const respond = (accept: boolean) => {
    respondInvite({ requestID: requestValue.id, accept });
  };
  onWatcherCleanup(onSecondaryButtonClick(() => {
    respond(false);
  }));
  onWatcherCleanup(onMainButtonClick(() => {
    respond(true);
  }));
});
</script>

<template>
  <Page
    preserve-main-button
    preserve-secondary-button
    @back="
      if (selectedRequest) {
        selectedRequest = undefined;
      } else {
        router.go(-1);
      }
    "
  >
    <PagePaddings>
      <PageLoading v-if="!transfers" />
      <template v-else>
        <List v-if="selectedRequest">
          <ListItem>
            <template #leftLabel>
              <ListItemLeftLabel :class="e('left-label')">
                {{ t('app') }}
              </ListItemLeftLabel>
            </template>
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>
                {{ selectedRequest.app.title + ' ' }}
                <span :class="e('entity-id')">
                  #{{ selectedRequest.app.id }}
                </span>
              </ListItemBodyLeftLabel>
            </template>
          </ListItem>

          <ListItem>
            <template #leftLabel>
              <ListItemLeftLabel :class="e('left-label')">
                {{ t('sender') }}
              </ListItemLeftLabel>
            </template>
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>
                {{ selectedRequest.from.name + ' ' }}
                <span :class="e('entity-id')">
                  #{{ selectedRequest.from.id }}
                </span>
              </ListItemBodyLeftLabel>
            </template>
          </ListItem>
        </List>

        <List v-else-if="transfers.length">
          <ListItem
            v-for="item in transfers"
            :key="item.id"
            large
            clickable
            @click="selectedRequest = item"
          >
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>
                {{ item.app.title + ' ' }}
                <span :class="e('entity-id')">#{{ item.app.id }}</span>
              </ListItemBodyLeftLabel>
            </template>
            <template #bodyLeftSubtitle>
              <ListItemBodyLeftSubtitle>
                {{ t('from', { name: item.from.name }) }}
              </ListItemBodyLeftSubtitle>
            </template>
            <template #bodyRightChevron>
              <ListItemBodyRightChevron />
            </template>
          </ListItem>
        </List>
        <Text
          is="p"
          v-else
          :class="e('no-transfers')"
          align="center"
        >
          {{ t('noTransfers') }}
        </Text>
      </template>
    </PagePaddings>
  </Page>
</template>

<style lang="scss">
.transfers-view {
  &__no-transfers {
    color: var(--theme-subtitle-text-color);
  }

  &__entity-id {
    color: var(--theme-subtitle-text-color);
  }

  &__left-label {
    width: 120px;
  }
}
</style>
