<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { AppRole } from 'schema';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { bem } from 'vue-ui';

import List from '@/ui/adapters/List.js';
import ListItem from '@/ui/adapters/ListItem.js';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel.js';
import Page from '@/ui/components/Page.vue';
import PageLoading from '@/ui/components/PageLoading.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';

import Apps from './Apps.vue';
import { useAppsViewQueryOptions } from './query-options.js';

const { t } = useI18n({
  messages: {
    en: {
      ownedAppsTitle: 'Your applications ({current} / {max})',
      ownedAppsFooter: 'Applications owned by you.',
      createNotAllowed: 'You can\'t create applications.',
      canCreateUpToPrefix: 'You can create up to',
      canCreateUpToSuffix: 'applications | application | applications',
      canCreatePrefix: 'You can create',
      canCreateUnlimited: 'unlimited',
      canCreateSuffix: 'count of applications.',
      createApp: 'Create application',
      managedAppsTitle: 'Managed applications',
      managedAppsFooter: 'Applications you have access to as a manager.',
      limitReached: 'You can\'t create more applications as the limit was reached.',
    },
    ru: {
      ownedAppsTitle: 'Ваши приложения ({current} / {max})',
      ownedAppsFooter: 'Приложения, которые принадлежат Вам.',
      createNotAllowed: 'Вы не можете создавать приложения.',
      canCreateUpToPrefix: 'Вы можете создать до',
      canCreateUpToSuffix: 'приложений | приложения | приложений',
      canCreatePrefix: 'Вы можете создать',
      canCreateUnlimited: 'неограниченное',
      canCreateSuffix: 'количество приложений.',
      createApp: 'Создать приложение',
      managedAppsTitle: 'Управляемые приложения',
      managedAppsFooter: 'Приложения, к которым Вы имеете доступ будучи их менеджером.',
      limitReached: 'Вы не можете создать приложение, так как достигли лимита.',
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
const isLimitReached = computed(() => {
  return typeof maxOwnedAppsCount.value === 'number'
    ? ownedApps.value.length >= maxOwnedAppsCount.value
    : false;
});
const [, e] = bem('apps-view');
</script>

<template>
  <Page>
    <PagePaddings>
      <PageLoading v-if="!data" />
      <template v-else>
        <List
          :title="t('ownedAppsTitle', {
            current: ownedApps.length,
            max: typeof maxOwnedAppsCount === 'number' ? maxOwnedAppsCount : '∞'
          })"
          :footer="isLimitReached ? t('limitReached') : undefined"
        >
          <ListItem
            :clickable="!isLimitReached"
            :variant="isLimitReached ? 'placeholder' : 'accent'"
            @click="!isLimitReached && router.push('/apps/create')"
          >
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>{{ t('createApp') }}</ListItemBodyLeftLabel>
            </template>
          </ListItem>
        </List>
        <List
          :footer="t('ownedAppsFooter')"
          :class="e('list')"
        >
          <Apps :apps="ownedApps" />
        </List>
        <List
          v-if="managedApps.length"
          :title="t('managedAppsTitle')"
          :footer="t('managedAppsFooter')"
          :class="e('list')"
        >
          <Apps
            :apps="managedApps"
            show-role
          />
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
