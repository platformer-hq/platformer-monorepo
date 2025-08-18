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
      title: 'Test groups',
      footer: 'Test groups are collections of users for specific platforms, each assigned a unique URL for the app. Test groups override other URL-related rules, such as platform-specific URLs and privacy levels.',
      create: 'Create test group',
      noTitle: '(empty title)',
      platforms: '{count} platforms | {count} platform | {count} platforms',
      users: '{count} users | {count} user | {count} users',
      enabled: 'Enabled',
      disabled: 'Disabled',
    },
    ru: {
      title: 'Тестовые группы',
      footer: 'Тестовые группы – коллекции пользователей на конкретных платформах, каждой из которых присвоена своя ссылка на приложение. Тестовые группы переопределяют другие правила, связанные со ссылками. Они являются более приоритетными, чем общие установленные ссылки для платформ, а также уровень приватности приложения.',
      create: 'Создать тестовую группу',
      noTitle: '(названия нет)',
      platforms: '{count} платформ | {count} платформа | {count} платформы | {count} платформ',
      users: '{count} пользователей | {count} пользователь | {count} пользователя | {count} пользователей',
      enabled: 'Включена',
      disabled: 'Отключена',
    },
  },
});
const { data, isPending } = useQuery(useAppTestGroupsViewQueryOptions(useAppIDFromParams()));
const router = useRouter();
const route = useRoute();
const readonly = computed(() => data.value && !isEditorAppRole(data.value.currentUserRole));
const [, e] = bem('app-test-groups-view');
</script>

<template>
  <Page>
    <PagePaddings>
      <PageLoading v-if="!data && isPending" />
      <AppNotFoundView v-else-if="!data" />
      <List
        v-else
        :title="t('title')"
      >
        <ListItem
          :variant="readonly ? 'placeholder' : 'accent'"
          :clickable="!readonly"
          @click="!readonly && router.push(`${route.path}/create`)"
        >
          <template #bodyLeftLabel>
            <ListItemBodyLeftLabel>
              {{ t('create') }}
            </ListItemBodyLeftLabel>
          </template>
        </ListItem>
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
    </PagePaddings>
  </Page>
</template>

<style lang="scss">
.app-test-groups-view {
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
