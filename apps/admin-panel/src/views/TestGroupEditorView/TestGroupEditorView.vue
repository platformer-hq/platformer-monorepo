<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import {
  hapticFeedbackSelectionChanged,
  onMainButtonClick,
  setMainButtonParams,
} from '@telegram-apps/sdk-vue';
import { computed, onWatcherCleanup, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { bem } from 'vue-ui';

import { isAnyHttpUrl } from '@/navigation/isAnyHttpUrl';
import { useGqlRequest } from '@/queries/useGqlRequest';
import Page from '@/ui/components/Page.vue';
import PageLoading from '@/ui/components/PageLoading.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';
import type { SelectedUser } from '@/ui/components/UserSelectionView/UserSelectionView.vue';
import UserSelectionView from '@/ui/components/UserSelectionView/UserSelectionView.vue';

import { TestGroupEditorViewData } from './operations';
import ActionsSection from './sections/ActionsSection.vue';
import EnabledSection from './sections/EnabledSection.vue';
import PlatformsSection from './sections/PlatformsSection.vue';
import TitleSection from './sections/TitleSection.vue';
import UrlSection from './sections/UrlSection.vue';
import UsersSection from './sections/UsersSection/UsersSection.vue';

const {
  onCreate,
  readonly,
  loading,
  enabled: propsEnabled = false,
  platformIds: propsPlatformIds = [],
  title: propsTitle = '',
  url: propsUrl = '',
  users: propsUsers = [],
} = defineProps<{
  appId: number;
  canIncreaseLimits?: boolean;
  enabled?: boolean;
  loading?: boolean;
  platformIds?: number[];
  readonly?: boolean;
  title?: string;
  url?: string;
  users?: SelectedUser[];
  maxUsers?: number | null;

  onCreate?(payload: {
    enabled: boolean;
    platformIDs: number[];
    title: string;
    url: string;
    userIDs: number[];
  }): void;
  onDelete?(): void;
}>();
const emit = defineEmits<{
  create: [{
    enabled: boolean;
    platformIDs: number[];
    title: string;
    url: string;
    userIDs: number[];
  }];
  delete: [];
  update: [{
    enabled: boolean;
    platformIDs: number[];
    title: string;
    url: string;
    users: SelectedUser[];
  }];
}>();

const { t } = useI18n({
  messages: {
    en: {
      create: 'Create',
      update: 'Update',
      urlInvalid: 'URL is invalid',
      delete: 'Delete test group',
    },
    ru: {
      create: 'Создать',
      update: 'Обновить',
      urlInvalid: 'Ссылка невалидна',
      delete: 'Удалить тестовую группу',
    },
  },
});

const request = useGqlRequest();
const { data: viewData } = useQuery({
  queryKey: ['test-group-editor-view-data'],
  queryFn: ({ signal }) => request(TestGroupEditorViewData, {}, signal),
});

const firstInteraction = ref(false);
const isSelectingUsers = ref(false);
const enabled = ref(propsEnabled || false);
const url = ref(propsUrl);
const title = ref(propsTitle);
const platformIds = ref<number[]>(propsPlatformIds);
const users = ref<SelectedUser[]>(propsUsers || []);

const dropIsSelectingUsers = () => {
  isSelectingUsers.value = false;
};

watchEffect(() => {
  enabled.value = propsEnabled;
  url.value = propsUrl || '';
  title.value = propsTitle || '';
  platformIds.value = propsPlatformIds || [];
  users.value = propsUsers || [];
});

const mode = computed<'create' | 'update'>(() => (onCreate ? 'create' : 'update'));
const disabled = computed(() => readonly || loading || false);
const isChanged = computed(() => {
  return (
    mode.value === 'update' && (
      enabled.value !== propsEnabled
      || title.value !== propsTitle
      || url.value !== propsUrl
      || users.value.length !== propsUsers.length
      || users.value.filter(u1 => propsUsers.every(u2 => u1.id !== u2.id)).length > 0
      || platformIds.value.length !== propsPlatformIds.length
      || platformIds.value.filter(p1 => !propsPlatformIds.includes(p1)).length > 0
    )
  );
});
const isUrlValid = computed(() => isAnyHttpUrl(url.value));

watchEffect(() => {
  if (!firstInteraction.value && url.value) {
    firstInteraction.value = true;
  }
});

watchEffect(() => {
  if (isSelectingUsers.value) {
    return;
  }
  if (
    // URL is not valid, but there was no first interaction with it.
    (!isUrlValid.value && !firstInteraction.value)
    // It is update mode, but nothing changed.
    || (mode.value === 'update' && !isChanged.value)
  ) {
    setMainButtonParams({ isVisible: false });
    return;
  }
  setMainButtonParams({
    isVisible: true,
    isLoaderVisible: loading,
    isEnabled: isUrlValid.value && !loading,
    text: t(isUrlValid.value
      ? mode.value === 'create' ? 'create' : 'update'
      : 'urlInvalid'),
  });
  onWatcherCleanup(onMainButtonClick(() => {
    const shared = {
      title: title.value,
      url: url.value.trim(),
      enabled: enabled.value,
      platformIDs: platformIds.value,
    };
    if (mode.value === 'create') {
      emit('create', { ...shared, userIDs: users.value.map(u => u.id) });
    } else {
      emit('update', { ...shared, users: users.value });
    }
  }));
});

const [, e] = bem('test-group-editor-view');
</script>

<template>
  <Page
    v-if="!viewData"
    preserve-main-button
  >
    <PagePaddings>
      <PageLoading />
    </PagePaddings>
  </Page>
  <UserSelectionView
    v-else-if="isSelectingUsers"
    :selected-users="users"
    :excluded-user-ids="users.map(u => u.id)"
    @done="dropIsSelectingUsers"
    @back="dropIsSelectingUsers"
    @user-selected="
      users = [...users, $event];
      hapticFeedbackSelectionChanged();
    "
    @user-deleted="
      users = users.filter(u => u.id !== $event.id);
      hapticFeedbackSelectionChanged();
    "
  />
  <Page
    v-else
    preserve-main-button
  >
    <PagePaddings>
      <EnabledSection
        v-model="enabled"
        :class="e('section')"
        :disabled
      />
      <TitleSection
        v-model="title"
        :class="e('section')"
        :disabled
      />
      <UrlSection
        v-model="url"
        :class="e('section')"
        :disabled
      />
      <PlatformsSection
        v-model="platformIds"
        :class="e('section')"
        :platforms="viewData.platforms"
        :disabled
      />
      <UsersSection
        v-model="users"
        :app-id
        :can-increase-limits
        :max-count="maxUsers"
        :class="e('section')"
        :disabled
        :readonly
        :platforms="
          viewData
            .platforms
            .filter(platform => platformIds.includes(platform.id))
            .map(p => p.completeTitle)
        "
        @start-selecting="isSelectingUsers = true"
      />
      <ActionsSection
        v-if="!readonly && onDelete"
        :disabled
        @delete="$emit('delete')"
      />
    </PagePaddings>
  </Page>
</template>

<style>
.test-group-editor-view__section {
  margin-bottom: 8px;
}
</style>
