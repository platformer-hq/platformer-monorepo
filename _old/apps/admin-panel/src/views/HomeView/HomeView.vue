<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { useI18n } from 'vue-i18n';
import { Apps30, bem, LockFill28, PersonHanshakeFill28, Trades30, UserCircleFill28 } from 'vue-ui';

import { injectAppVerison } from '@/providers/appVersion';
import List from '@/ui/adapters/List.js';
import Text from '@/ui/adapters/Text.vue';
import Page from '@/ui/components/Page.vue';
import PageLoading from '@/ui/components/PageLoading.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';
import { createCustomListItemIcon } from '@/ui/helpers/createCustomListItemIcon';

import ListItem from './ListItem.vue';
import { useHomeViewQueryOptions } from './query-options';

const [, e] = bem('home-view');

const PrivacyIcon = createCustomListItemIcon(LockFill28, 24, '#8E8E93');
const ProfileIcon = createCustomListItemIcon(UserCircleFill28, 24, '#FF3B30');
const ManagementInvitesIcon = createCustomListItemIcon(PersonHanshakeFill28, 20, '#FF9500');

const appVersion = injectAppVerison();
const { t } = useI18n({
  messages: {
    en: {
      apps: 'Applications',
      invites: 'Management Invites',
      transferRequests: 'App Transfer Requests',
      profile: 'My Profile',
      privacy: 'Privacy and Security',
      version: 'App version: v{version}',
    },
    ru: {
      apps: 'Приложения',
      invites: 'Приглашения на управление',
      transferRequests: 'Трансферы приложений',
      profile: 'Мой профиль',
      privacy: 'Приватность и безопасность',
      version: 'Версия приложения: v{version}',
    },
  },
});

const { data } = useQuery(useHomeViewQueryOptions());
</script>

<template>
  <Page back="disable">
    <PagePaddings>
      <PageLoading v-if="!data" />
      <template v-else>
        <List>
          <ListItem
            v-for="(item, idx) of [
              {
                icon: Apps30,
                color: 'accent-text',
                titleKey: 'apps',
                path: 'apps',
              },
              {
                icon: ManagementInvitesIcon,
                color: 'text',
                titleKey: 'invites',
                path: 'invites',
                count: data.managementInvites.length,
              },
              {
                icon: Trades30,
                color: '#AF52DE',
                titleKey: 'transferRequests',
                path: 'transfers',
                count: data.appTransferRequests.length,
              },
            ]"
            :key="idx"
            v-bind="item"
            :title="t(item.titleKey)"
          />
        </List>
        <List :class="e('list')">
          <ListItem
            :icon="ProfileIcon"
            color="white"
            :title="t('profile')"
            path="profile"
          />
        </List>
        <List :class="e('list')">
          <ListItem
            :icon="PrivacyIcon"
            color="white"
            :title="t('privacy')"
            path="privacy"
          />
        </List>
        <Text
          is="p"
          :class="e('version')"
          variant="footnote"
          align="center"
        >
          {{ t('version', {version: appVersion}) }}
        </Text>
      </template>
    </PagePaddings>
  </Page>
</template>

<style lang="scss">
.home-view {
  &__list {
    margin-top: 16px;
  }

  &__version {
    margin-top: 16px;
    color: var(--theme-subtitle-text-color);
  }
}
</style>
