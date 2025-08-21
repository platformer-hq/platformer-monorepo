<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { bem } from 'vue-ui';

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
      footer: 'Test groups are collections of users for specific platforms, each assigned a unique URL for the app. Test groups override other URL-related rules, such as platform-specific URLs and privacy levels.',
      create: 'Create test group',
      noTitle: '(empty title)',
      platforms: '{count} platforms | {count} platform | {count} platforms',
      users: '{count} users | {count} user | {count} users',
      enabled: 'Enabled',
      disabled: 'Disabled',
      limitReached: 'You\'ve reached your test groups limit for this application.',
      limitReachedPremium: 'To create more test groups, you can purchase a <a>subscription</a>.',
    },
    ru: {
      title: 'Тестовые группы ({current} / {max})',
      footer: 'Тестовые группы – коллекции пользователей на конкретных платформах, каждой из которых присвоена своя ссылка на приложение. Тестовые группы переопределяют другие правила, связанные со ссылками. Они являются более приоритетными, чем общие установленные ссылки для платформ, а также уровень приватности приложения.',
      create: 'Создать тестовую группу',
      noTitle: '(названия нет)',
      platforms: '{count} платформ | {count} платформа | {count} платформы | {count} платформ',
      users: '{count} пользователей | {count} пользователь | {count} пользователя | {count} пользователей',
      enabled: 'Включена',
      disabled: 'Отключена',
      limitReached: 'Вы достигли лимита по количеству тестовых групп для этого приложения.',
      limitReachedPremium: 'Для создания большего количества тестовых групп, Вы можете приобрести <a>подписку</a>.',
    },
  },
});
const appId = useAppIDFromParams();
const { data, isPending } = useQuery(useAppTestGroupsViewQueryOptions(appId));
const router = useRouter();
const route = useRoute();

const hasActiveSub = computed(() => {
  const endsAt = data.value?.subscription?.endsAt;
  return endsAt
    ? Date.now() < new Date(endsAt).getTime()
    : false;
});
const isEditor = computed(() => data.value && isEditorAppRole(data.value.currentUserRole));
const isLimitReached = computed(() => {
  if (!data.value) {
    return false;
  }
  const { limits: { maxTestGroupsCount }, testGroups } = data.value;
  return typeof maxTestGroupsCount === 'number'
    ? testGroups.length >= maxTestGroupsCount
    : false;
});
const canCreate = computed(() => !isEditor.value && !isLimitReached.value);

const onLimitReachedClick = async (e: MouseEvent) => {
  if (e.target instanceof HTMLAnchorElement) {
    await router.push(`/apps/${appId}/premium`);
  }
};

const [, e] = bem('app-test-groups-view');
</script>

<template>
  <Page>
    <PagePaddings>
      <PageLoading v-if="!data && isPending" />
      <AppNotFoundView v-else-if="!data" />
      <template v-else>
        <List
          :title="t('title', {
            current: data.testGroups.length,
            max: typeof data.limits.maxTestGroupsCount === 'number'
              ? data.limits.maxTestGroupsCount
              : '∞'
          })"
        >
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
            v-if="isLimitReached"
            #footer
          >
            {{ t('limitReached') }}
            <span
              v-if="!hasActiveSub"
              :class="e('limit-reached')"
              @click="onLimitReachedClick"
              v-html="t('limitReachedPremium')"
            />
          </template>
        </List>
        <List :class="e('list')">
          <ListItem
            v-for="testGroup in data.testGroups"
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
            {{ t('footer') }}
          </template>
        </List>
      </template>
    </PagePaddings>
  </Page>
</template>

<style lang="scss">
@use "@/vue-ui/styles/mixins";

.app-test-groups-view {
  &__limit-reached a {
    color: var(--theme-accent-text-color);
    @include mixins.clickable;
  }

  &__empty {
    padding: 16px;
    color: var(--theme-subtitle-text-color);
  }

  &__list {
    margin-top: 16px;
  }

  &__empty-name {
    font-style: italic;
  }
}
</style>
