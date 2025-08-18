<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { AppRole } from 'schema';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import List from '@/ui/adapters/List.js';
import ListItem from '@/ui/adapters/ListItem.js';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel.js';
import Text from '@/ui/adapters/Text.vue';
import Page from '@/ui/components/Page.vue';
import PageLoading from '@/ui/components/PageLoading.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';

import Apps from './Apps.vue';
import { useAppsViewQueryOptions } from './query-options.js';

const { t } = useI18n({
  messages: {
    en: {
      yourAppsTitle: 'Your applications',
      yourAppsFooter: 'Applications owned by you.',
      createNotAllowed: 'You can\'t create applications.',
      canCreateUpToPrefix: 'You can create up to',
      canCreateUpToSuffix: 'applications | application | applications',
      canCreatePrefix: 'You can create',
      canCreateUnlimited: 'unlimited',
      canCreateSuffix: 'count of applications.',
      createApp: 'Create application',
      managedAppsTitle: 'Managed applications',
      managedAppsFooter: 'Applications you have access to as a manager.',
    },
    ru: {
      yourAppsTitle: 'Ваши приложения',
      yourAppsFooter: 'Приложения, которые принадлежат Вам.',
      createNotAllowed: 'Вы не можете создавать приложения.',
      canCreateUpToPrefix: 'Вы можете создать до',
      canCreateUpToSuffix: 'приложений | приложения | приложений',
      canCreatePrefix: 'Вы можете создать',
      canCreateUnlimited: 'неограниченное',
      canCreateSuffix: 'количество приложений.',
      createApp: 'Создать приложение',
      managedAppsTitle: 'Управляемые приложения',
      managedAppsFooter: 'Приложения, к которым Вы имеете доступ будучи их менеджером.',
    },
  },
});
const router = useRouter();
const { data } = useQuery(useAppsViewQueryOptions());
const maxOwnedAppsCount = computed(() => {
  const count = data?.value?.limits.maxOwnedAppsCount;
  return typeof count === 'number' ? count : undefined;
});
const managedApps = computed(() => {
  return data?.value?.apps.filter(app => app.role !== AppRole.Owner).sort((a, b) => {
    return a.app.id - b.app.id;
  }) || [];
});
const ownedApps = computed(() => {
  return data?.value?.apps.filter(app => app.role === AppRole.Owner).sort((a, b) => {
    return a.app.id - b.app.id;
  }) || [];
});
</script>

<template>
  <Page>
    <PagePaddings>
      <PageLoading v-if="!data" />
      <template v-else>
        <List :title="t('yourAppsTitle')">
          <ListItem
            v-if="maxOwnedAppsCount === undefined || ownedApps.length < maxOwnedAppsCount"
            clickable
            variant="accent"
            @click="router.push('/apps/create')"
          >
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>
                {{ t('createApp') }}
              </ListItemBodyLeftLabel>
            </template>
          </ListItem>
          <Apps :apps="ownedApps" />
          <template #footer>
            {{ t('yourAppsFooter') }}
            <template v-if="maxOwnedAppsCount === 0">
              {{ t('createNotAllowed') }}
            </template>
            <template v-else-if="maxOwnedAppsCount">
              {{ t('canCreateUpToPrefix') }}
              <Text weight="semibold">
                {{ maxOwnedAppsCount }}
              </Text>
              {{ t('canCreateUpToSuffix', maxOwnedAppsCount) }}
            </template>
            <template v-else>
              {{ t('canCreatePrefix') }}
              <Text weight="semibold">
                {{ t('canCreateUnlimited') }}
              </Text>
              {{ t('canCreateSuffix') }}
            </template>
          </template>
        </List>
        <List
          v-if="managedApps.length"
          :title="t('managedAppsTitle')"
          class="apps-view__list"
        >
          <Apps
            :apps="managedApps"
            show-role
          />
          <template #footer>
            {{ t('managedAppsFooter') }}
          </template>
        </List>
      </template>
    </PagePaddings>
  </Page>
</template>

<style>
.apps-view__list {
  margin-top: 8px;
}
</style>
