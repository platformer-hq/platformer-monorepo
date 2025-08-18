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
import { AppManagementInviteRole } from 'schema';
import { onWatcherCleanup, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { bem } from 'vue-ui';

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

import { useMutationFn } from '@/queries/useMutationFn.js';
import { refetchAppsViewQuery } from '@/views/AppsView/query-options';
import { refetchHomeViewQuery } from '@/views/HomeView/query-options';
import { Respond, type RespondMutation, type RespondMutationVariables } from './operations.js';
import { setInvitesViewQueryData, useInvitesViewQueryOptions } from './query-options.js';

const [, e] = bem('invites-view');

const router = useRouter();
const { t } = useI18n({
  messages: {
    en: {
      accept: 'Accept',
      decline: 'Decline',
      app: 'Application',
      sender: 'Sender',
      role: 'To Become',
      noInvites: 'You have no management invites',
      fromComplete: 'From {name} to become {role}',
      admin: 'Admin',
      owner: 'Owner',
      manager: 'Member',
    },
    ru: {
      accept: 'Принять',
      decline: 'Отклонить',
      app: 'Приложение',
      sender: 'Отправитель',
      role: 'Роль',
      noInvites: 'У Вас нет приглашений на управление',
      fromComplete: 'От {name} на роль {role}',
      admin: 'Администратор',
      owner: 'Владелец',
      manager: 'Участник',
    },
  },
});
const client = useQueryClient();
const { data: invites } = useQuery(useInvitesViewQueryOptions());
const { isPending: isResponding, mutate: respondInvite } = useMutation<
  RespondMutation,
  unknown,
  RespondMutationVariables
>({
  mutationFn: useMutationFn(Respond),
  onSuccess(_data, variables) {
    setInvitesViewQueryData(client, data => {
      if (!data) {
        return;
      }
      const { currentUser } = data;
      currentUser.managementInvites = currentUser
        .managementInvites
        .filter(item => item.id !== variables.inviteID);
      return data;
    });
    refetchHomeViewQuery(client).catch(e => {
      console.log('Failed to revalidate main page data', e);
    });
    refetchAppsViewQuery(client).catch(e => {
      console.log('Failed to revalidate apps page data', e);
    });
    invite.value = undefined;
  },
});

const invite = ref<{
  id: number;
  from: { id: number; name: string };
  app: { id: number; title: string };
  role: AppManagementInviteRole;
} | undefined>();
const themeTextColor = useSignal(themeParamsTextColor);
const themeDestructiveTextColor = useSignal(themeParamsDestructiveTextColor);

const translateRole = (role: AppManagementInviteRole) => {
  return t(({
    [AppManagementInviteRole.Admin]: 'admin',
    [AppManagementInviteRole.Member]: 'member',
  } as const)[role]);
};

watchEffect(() => {
  const { value: inviteValue } = invite;
  if (!inviteValue) {
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
    respondInvite({ inviteID: inviteValue.id, accept });
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
      if (invite) {
        invite = undefined;
      } else {
        router.go(-1);
      }
    "
  >
    <PagePaddings>
      <PageLoading v-if="!invites" />
      <template v-else>
        <List v-if="invite">
          <ListItem>
            <template #leftLabel>
              <ListItemLeftLabel :class="e('left-label')">
                {{ t('app') }}
              </ListItemLeftLabel>
            </template>
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>
                {{ invite.app.title }}{{ ' ' }}
                <span :class="e('entity-id')">
                  #{{ invite.app.id }}
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
                {{ invite.from.name }}{{ ' ' }}
                <span :class="e('entity-id')">
                  #{{ invite.from.id }}
                </span>
              </ListItemBodyLeftLabel>
            </template>
          </ListItem>

          <ListItem>
            <template #leftLabel>
              <ListItemLeftLabel :class="e('left-label')">
                {{ t('role') }}
              </ListItemLeftLabel>
            </template>
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>
                {{ translateRole(invite.role) }}
              </ListItemBodyLeftLabel>
            </template>
          </ListItem>
        </List>

        <List v-else-if="invites.length">
          <ListItem
            v-for="item in invites"
            :key="item.id"
            large
            clickable
            @click="invite = item"
          >
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>
                {{ item.app.title + ' ' }}
                <span :class="e('entity-id')">#{{ item.app.id }}</span>
              </ListItemBodyLeftLabel>
            </template>
            <template #bodyLeftSubtitle>
              <ListItemBodyLeftSubtitle>
                {{ t('fromComplete', { name: item.from.name, role: translateRole(item.role) }) }}
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
          :class="e('no-invites')"
          align="center"
        >
          {{ t('noInvites') }}
        </Text>
      </template>
    </PagePaddings>
  </Page>
</template>

<style lang="scss">
.invites-view {
  &__no-invites {
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
