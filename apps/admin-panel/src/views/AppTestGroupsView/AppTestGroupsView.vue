<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { bem } from 'vue-ui';

import Link from '@/navigation/Link.vue';
import { useAppIDFromParams } from '@/navigation/useAppIDFromParams';
import { isEditorAppRole } from '@/roles/isEditorAppRole';
import List from '@/ui/adapters/List';
import ListItem from '@/ui/adapters/ListItem';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel';
import ListItemBodyLeftSubtitle from '@/ui/adapters/ListItemBodyLeftSubtitle';
import ListItemBodyRightChevron from '@/ui/adapters/ListItemBodyRightChevron';
import ListItemBodyRightLabel from '@/ui/adapters/ListItemBodyRightLabel';
import Text from '@/ui/adapters/Text.vue';
import Page from '@/ui/components/Page.vue';
import PageLoading from '@/ui/components/PageLoading.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';
import AppNotFoundView from '@/views/AppNotFoundView/AppNotFoundView.vue';

import { useAppTestGroupsViewQueryOptions } from './query-options';

const { t } = useI18n({
  messages: {
    en: {
      title: 'Test groups ({current} / {max})',
      about: 'Test groups are collections of users for specific platforms, each assigned a unique URL for the app.',
      learnMore: 'Learn more',
      create: 'Create test group',
      noTitle: '(empty title)',
      platforms: '{count} platforms | {count} platform | {count} platforms',
      users: '{count} users | {count} user | {count} users',
      enabled: 'Enabled',
      disabled: 'Disabled',
      limitReached: 'You\'ve reached your test groups limit for this application.',
      limitReachedPremiumSub: 'subscription',
      limitReachedPremium: 'To create more test groups, you can purchase a {subscription}.',
    },
    ru: {
      title: 'Тестовые группы ({current} / {max})',
      about: 'Тестовые группы – коллекции пользователей на конкретных платформах, каждой из которых присвоена своя ссылка на приложение.',
      learnMore: 'Подробнее',
      create: 'Создать тестовую группу',
      noTitle: '(названия нет)',
      platforms: '{count} платформ | {count} платформа | {count} платформы | {count} платформ',
      users: '{count} пользователей | {count} пользователь | {count} пользователя | {count} пользователей',
      enabled: 'Включена',
      disabled: 'Отключена',
      limitReached: 'Вы достигли лимита по количеству тестовых групп для этого приложения.',
      limitReachedPremiumSub: 'подписку',
      limitReachedPremium: 'Для создания большего количества тестовых групп, Вы можете приобрести {subscription}.',
    },
  },
});
const appId = useAppIDFromParams();
const { data, isPending } = useQuery(useAppTestGroupsViewQueryOptions(appId));
const router = useRouter();
const route = useRoute();

const hasActiveSub = computed(() => {
  const endsAt = data.value?.subscription?.endsAt;
  return endsAt ? Date.now() < new Date(endsAt).getTime() : false;
});
const isEditor = computed(() => !!data.value && isEditorAppRole(data.value.currentUserRole));
const testGroups = computed(() => data.value?.testGroups || []);
const maxTestGroups = computed(() => data.value?.limits.maxTestGroupsCount);
const isLimitReached = computed(() => {
  return typeof maxTestGroups.value === 'number'
    ? testGroups.value.length >= maxTestGroups.value
    : false;
});
const canCreate = computed(() => isEditor.value && !isLimitReached.value);

const [, e] = bem('app-test-groups-view');
const docsLink = 'https://docs.mini-apps.store/test-groups';
</script>

<template>
  <Page>
    <PagePaddings>
      <PageLoading v-if="!data && isPending" />
      <AppNotFoundView v-else-if="!data" />
      <template v-else>
        <List :title="t('title', { current: testGroups.length, max: maxTestGroups ?? '∞' })">
          <ListItem
            :variant="canCreate ? 'accent' : 'placeholder'"
            :clickable="canCreate"
            @click="canCreate && router.push(`${route.path}/create`)"
          >
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>{{ t('create') }}</ListItemBodyLeftLabel>
            </template>
          </ListItem>
          <template
            v-if="isLimitReached || !testGroups.length"
            #footer
          >
            <template v-if="isLimitReached">
              {{ t('limitReached') }}
              <i18n-t
                v-if="!hasActiveSub"
                keypath="limitReachedPremium"
              >
                <template #subscription>
                  <Link :to="`/apps/${appId}/premium`">
                    {{ t('limitReachedPremiumSub') }}
                  </Link>
                </template>
              </i18n-t>
            </template>
            <template v-else>
              {{ t('about') }}
              <Link :to="docsLink">
                {{ t('learnMore') }}
              </Link>
            </template>
          </template>
        </List>
        <List
          v-if="testGroups.length"
          :class="e('list')"
        >
          <ListItem
            v-for="testGroup in testGroups"
            :key="testGroup.id"
            large
            clickable
            @click="router.push(`${route.path}/${testGroup.id}`)"
          >
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>
                <Text :class="!testGroup.title && e('empty-name')">
                  {{ testGroup.title ? testGroup.title : t('noTitle') }}
                </Text>
              </ListItemBodyLeftLabel>
            </template>
            <template #bodyLeftSubtitle>
              <ListItemBodyLeftSubtitle>
                {{ t('platforms', testGroup.platforms.length) }} ·{{ ' ' }}
                {{ t('users', {count: testGroup.users.length}) }}
              </ListItemBodyLeftSubtitle>
            </template>
            <template #bodyRightLabel>
              <ListItemBodyRightLabel>
                {{ t(testGroup.enabled ? 'enabled' : 'disabled') }}
              </ListItemBodyRightLabel>
            </template>
            <template #bodyRightChevron>
              <ListItemBodyRightChevron />
            </template>
          </ListItem>
          <template #footer>
            {{ t('about') }}
            <Link :to="docsLink">
              {{ t('learnMore') }}
            </Link>
          </template>
        </List>
      </template>
    </PagePaddings>
  </Page>
</template>

<style lang="scss">
.app-test-groups-view {
  &__list {
    margin-top: 8px;
  }

  &__empty-name {
    font-style: italic;
  }
}
</style>
