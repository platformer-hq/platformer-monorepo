<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { onMainButtonClick, setMainButtonParams, showPopup } from '@telegram-apps/sdk-vue';
import { computed, onWatcherCleanup, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

import { useAppIDFromParams } from '@/navigation/useAppIDFromParams';
import { useMutationFn } from '@/queries/useMutationFn';
import { isOwnerAppRole } from '@/roles/isOwnerAppRole';
import List from '@/ui/adapters/List';
import ListItem from '@/ui/adapters/ListItem';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel';
import ListItemBodyLeftSubtitle from '@/ui/adapters/ListItemBodyLeftSubtitle';
import ListItemBodyRightClear from '@/ui/adapters/ListItemBodyRightClear';
import ListItemBodyRightLabel from '@/ui/adapters/ListItemBodyRightLabel';
import ListItemLeftLabel from '@/ui/adapters/ListItemLeftLabel';
import Page from '@/ui/components/Page.vue';
import PageLoading from '@/ui/components/PageLoading.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';
import type { SelectedUser } from '@/ui/components/UserSelectionView/UserSelectionView.vue';
import UserSelectionView from '@/ui/components/UserSelectionView/UserSelectionView.vue';
import AppNotFoundView from '@/views/AppNotFoundView/AppNotFoundView.vue';

import {
  CreateTransferRequest,
  RevokeTransfer,
  type CreateTransferRequestMutation,
  type CreateTransferRequestMutationVariables,
  type RevokeTransferMutation,
  type RevokeTransferMutationVariables,
} from './operations';
import { setAppTransferViewQueryData, useAppTransferViewQueryOptions } from './query-options';

const { t } = useI18n({
  messages: {
    en: {
      title: 'Application transfer',
      btnTransfer: 'Transfer application',
      btnDisallowedTitle: 'Transfer forbidden',
      btnDisallowedReadonlySubtitle: 'Not enough rights',
      btnDisallowedExistingSubtitle: 'Active transfer request exists',
      footer: 'Platformer allows application owners to transfer their application to other users. When a transfer request is sent, the recipient must accept it. Once accepted, they become the new app owner, and you are assigned the app admin role.',
      selectedUserTitle: 'Selected user',
      selectedUserFooter: 'After accepting the application transfer request, this user will become the owner, and you will be assigned as an administrator.',
      mbCreateRequest: 'Create transfer request',
      activeRequestTitle: 'Active transfer request',
      activeRequestFooter: 'A transfer request has been sent to this user for your application. To complete the transfer, they need to open the admin panel and confirm the request.\n',
      activeRequestTo: 'For {name}',
      confirmRevokeTitle: 'Confirm revoke',
      confirmRevokeMessage: 'Are you sure you want to revoke app transfer request sent to {name}?',
      confirmRevokeCancel: 'Cancel',
      confirmRevokeConfirm: 'Revoke request',
    },
    ru: {
      title: 'Перенос приложения',
      btnTransfer: 'Передать приложение',
      btnDisallowedTitle: 'Перенос невозможен',
      btnDisallowedReadonlySubtitle: 'У Вас недостаточно прав',
      btnDisallowedExistingSubtitle: 'Запрос на перенос уже существует',
      footer: 'Платформер позволяет владельцам приложений передавать свои приложения другим пользователям. После того, как запрос на передачу был отправлен, получатель должен принять его. После принятия, получатель станет владельцем приложения, а Вы будете назначены на роль администратора.',
      selectedUserTitle: 'Выбранный пользователь',
      selectedUserFooter: 'После принятия запроса на перенос, этот пользователь станет его владельцем, а Вы будете назначены администратором.',
      mbCreateRequest: 'Создать запрос на перенос',
      activeRequestTitle: 'Активный запрос на перенос',
      activeRequestFooter: 'Этому пользователю был отправлен запрос на передачу Вашего приложения. Для завершения переноса, он должен войти в панель управления и подтвердить запрос.',
      activeRequestTo: 'Для {name}',
      confirmRevokeTitle: 'Подтвердите отзыв',
      confirmRevokeMessage: 'Вы уверены, что хотите отозвать запрос на передачу владения, направленный {name}?',
      confirmRevokeCancel: 'Отмена',
      confirmRevokeConfirm: 'Отозвать запрос',
    },
  },
});

const appId = useAppIDFromParams();
const client = useQueryClient();
const { data, isPending } = useQuery(useAppTransferViewQueryOptions(appId));
const { mutate: createTransferRequest, isPending: isCreatingTransferRequest } = useMutation<
  CreateTransferRequestMutation,
  unknown,
  CreateTransferRequestMutationVariables
>({
  mutationKey: ['create-app-transfer'],
  mutationFn: useMutationFn(CreateTransferRequest),
  onSuccess(response) {
    setAppTransferViewQueryData([appId], client, prev => {
      if (prev?.app) {
        const { createAppTransferRequest: newRequest } = response;
        prev.app.transferRequest = newRequest;
        return prev;
      }
    });
    dropSelectedUser();
  },
});
const { mutate: revokeTransferRequest, isPending: isRevokingTransferRequest } = useMutation<
  RevokeTransferMutation,
  unknown,
  RevokeTransferMutationVariables
>({
  mutationKey: ['revoke-app-transfer'],
  mutationFn: useMutationFn(RevokeTransfer),
  onSuccess() {
    setAppTransferViewQueryData([appId], client, prev => {
      if (prev?.app) {
        prev.app.transferRequest = undefined;
        return prev;
      }
    });
  },
});
const isMutating = computed(() => {
  return isCreatingTransferRequest.value || isRevokingTransferRequest.value;
});

const selectedUser = ref<SelectedUser>();
const isSelectingUser = ref(false);
const dropIsSelectingUser = () => {
  isSelectingUser.value = false;
};
const dropSelectedUser = () => {
  selectedUser.value = undefined;
};
const readonly = computed(() => {
  return data.value && !isOwnerAppRole(data.value.currentUserRole);
});

watchEffect(() => {
  const user = selectedUser.value;
  if (user) {
    setMainButtonParams({
      text: t('mbCreateRequest'),
      isVisible: true,
      isEnabled: !isMutating.value,
      isLoaderVisible: isMutating.value,
    });
    onWatcherCleanup(onMainButtonClick(() => {
      createTransferRequest({ appID: appId, toUserID: user.id });
    }));
  }
});

const onRevoke = async () => {
  const transferRequest = data.value?.transferRequest;
  if (isMutating.value || !transferRequest) {
    return;
  }
  if (await showPopup({
    title: t('confirmRevokeTitle'),
    message: t('confirmRevokeMessage', { name: transferRequest.to.name }),
    buttons: [
      { id: 'no', type: 'default', text: t('confirmRevokeCancel') },
      { id: 'yes', type: 'destructive', text: t('confirmRevokeConfirm') },
    ],
  }) === 'yes') {
    revokeTransferRequest({ requestID: transferRequest.id });
  }
};
</script>

<template>
  <Page v-if="!data && isPending">
    <PagePaddings>
      <PageLoading />
    </PagePaddings>
  </Page>
  <AppNotFoundView v-else-if="!data" />
  <template v-else>
    <Page
      v-if="selectedUser"
      preserve-main-button
      @back="dropSelectedUser"
    >
      <PagePaddings>
        <List
          :title="t('selectedUserTitle')"
          :footer="t('selectedUserFooter')"
        >
          <ListItem>
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>{{ selectedUser.name }}</ListItemBodyLeftLabel>
            </template>
            <template #bodyRightLabel>
              <ListItemBodyRightLabel>#{{ selectedUser.id }}</ListItemBodyRightLabel>
            </template>
          </ListItem>
        </List>
      </PagePaddings>
    </Page>
    <UserSelectionView
      v-else-if="isSelectingUser"
      search-for="app-transfer"
      @user-selected="
        selectedUser = $event;
        isSelectingUser = false;
      "
      @back="dropIsSelectingUser"
    />
    <Page v-else>
      <PagePaddings>
        <List
          :title="t('title')"
          :footer="t('footer')"
        >
          <ListItem
            v-if="!data.transferRequest && !readonly"
            variant="accent"
            clickable
            @click="isSelectingUser = true"
          >
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>{{ t('btnTransfer') }}</ListItemBodyLeftLabel>
            </template>
          </ListItem>
          <ListItem
            v-else
            large
            variant="placeholder"
          >
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>{{ t('btnDisallowedTitle') }}</ListItemBodyLeftLabel>
            </template>
            <template #bodyLeftSubtitle>
              <ListItemBodyLeftSubtitle>
                {{ t(readonly
                  ? 'btnDisallowedReadonlySubtitle'
                  : 'btnDisallowedExistingSubtitle') }}
              </ListItemBodyLeftSubtitle>
            </template>
          </ListItem>
        </List>
        <List
          v-if="data.transferRequest"
          class="app-transfer-view__list"
          :title="t('activeRequestTitle')"
          :footer="t('activeRequestFooter')"
        >
          <ListItem :variant="isMutating ? 'placeholder' : 'regular'">
            <template #leftLabel>
              <ListItemLeftLabel>
                {{ t('activeRequestTo', { name: data.transferRequest.to.name }) }}
              </ListItemLeftLabel>
            </template>
            <template
              v-if="!readonly"
              #bodyRightClear
            >
              <ListItemBodyRightClear @click="onRevoke" />
            </template>
          </ListItem>
        </List>
      </PagePaddings>
    </Page>
  </template>
</template>

<style>
.app-transfer-view__list {
    margin-top: 16px;
}
</style>
