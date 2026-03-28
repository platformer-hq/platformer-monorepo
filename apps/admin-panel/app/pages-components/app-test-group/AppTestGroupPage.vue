<script setup lang="ts">
import * as v from 'valibot';

import HttpWarning from './_components/HttpWarning.vue';
import { useCreateTestGroup } from './_composables/useCreateTestGroup';
import { useDeleteTestGroup } from './_composables/useDeleteTestGroup';
import { useUpdateTestGroup } from './_composables/useUpdateTestGroup';
import ActionsSection from './_sections/ActionsSection.vue';
import EnabledSection from './_sections/EnabledSection.vue';
import PlatformsSection from './_sections/PlatformsSection.vue';
import TitleSection from './_sections/TitleSection.vue';
import UrlSection from './_sections/UrlSection.vue';
import UsersSection from './_sections/UsersSection.vue';

const { query, update: updateQuery } = useParsedQuery({
  appId: v.pipe(v.string(), v.transform(Number)),
  testGroupId: v.nullish(v.pipe(v.string(), v.transform(Number))),
  userSelectionNavId: v.nullish(v.pipe(v.string(), v.transform(Number))),
});
const { t } = useI18n({
  messages: {
    en: {
      'button.create': 'Create',
      'button.update': 'Update',
      'button.invalidUrl': 'URL is invalid',
    },
    ru: {
      'button.create': 'Создать',
      'button.update': 'Обновить',
      'button.invalidUrl': 'Ссылка невалидна',
    },
  },
});
const isPageEntered = useIsCurrentPageEntered();
const userSelectionStore = useUserSelectionStore();

//#region Requests.
const { options: appTestGroupPageQueryOptions } = useAppTestGroupPageQueryMeta();
const { data, isPending: isRefreshingPageData } = useQuery(() => appTestGroupPageQueryOptions({
  appId: query.value.appId,
  testGroupId: query.value.testGroupId || undefined,
}));
const {
  mutate: deleteTestGroup,
  isLoading: isDeletingTestGroup,
} = useDeleteTestGroup(query.value.appId);
const {
  mutate: updateTestGroup,
  isLoading: isUpdatingTestGroup,
} = useUpdateTestGroup(query.value.appId);
const { mutate: createTestGroup, isLoading: isCreatingTestGroup } = useCreateTestGroup();
const isSendingRequest = computed(() => (
  isRefreshingPageData.value
  || isUpdatingTestGroup.value
  || isCreatingTestGroup.value
  || isDeletingTestGroup.value
));
// const isSendingRequest = computed(() => true);
//#endregion

const userSelectionNavId = query.value.userSelectionNavId || Math.random();
const enabled = ref(false);
const title = ref('');
const url = ref('');
const platformIds = ref<number[]>([]);
const users = ref<{ id: number; name: string }[]>([]);

const readonly = computed(() => (
  !!data.value?.currentUserRole && !isEditorRole(data.value.currentUserRole)
));
// const readonly = computed(() => true);
const isUrlValid = computed(() => isValidUrl(url.value));
const isUpdateMode = computed(() => typeof query.value.testGroupId === 'number');
const isLoadingForUpdate = computed(() => isUpdateMode.value && isRefreshingPageData.value);
const showBottomBar = computed(() => {
  if (!isPageEntered.value || !data.value) {
    return false;
  }
  if (!data.value.testGroup) {
    return true;
  }
  const prev = data.value.testGroup;
  return prev.enabled !== enabled.value
    || prev.title !== title.value
    || prev.url !== url.value
    || prev.users.length !== users.value.length
    || prev.users.some(u1 => users.value.every(u2 => u1.id !== u2.id))
    || prev.platformIds.length !== platformIds.value.length
    || prev.platformIds.some(platformId => !platformIds.value.includes(platformId));
});

const handleButtonClick = () => {
  const shared = {
    enabled: enabled.value,
    title: title.value,
    platformIds: platformIds.value,
    url: url.value,
    userIds: users.value.map(user => user.id),
  };
  if (query.value.testGroupId) {
    updateTestGroup({ ...shared, testGroupId: query.value.testGroupId });
  } else {
    createTestGroup({ ...shared, appId: query.value.appId });
  }
};
const handleDelete = () => {
  if (query.value.testGroupId) {
    deleteTestGroup({ testGroupId: query.value.testGroupId });
  }
};

watch(() => ({
  testGroup: data.value?.testGroup,
  userSelection: userSelectionStore.navId === query.value.userSelectionNavId
    ? [...userSelectionStore.selectedUsers || []]
    : null,
}), ({ testGroup, userSelection }) => {
  if (testGroup) {
    enabled.value = testGroup.enabled;
    title.value = testGroup.title;
    platformIds.value = [...testGroup.platformIds];
    url.value = testGroup.url;
    users.value = userSelection || [...testGroup.users];
  }
}, { immediate: true, deep: true });

onMounted(() => {
  updateQuery({ userSelectionNavId }, { replace: true });
});
</script>

<template>
  <PageRoot colors="secondary-bg">
    <PageContent>
      <PagePaddings>
        <EnabledSection v-model="enabled" :disabled="isSendingRequest || readonly" :readonly/>
        <TitleSection
          v-model.trim="title"
          :disabled="isSendingRequest || readonly"
          :loading="isLoadingForUpdate"
        />
        <UrlSection
          v-model.trim="url"
          :disabled="isSendingRequest || readonly"
          :loading="isLoadingForUpdate"
        />
        <HttpWarning :show="url.startsWith('http:')"/>
        <PlatformsSection
          v-model="platformIds"
          :platforms="data?.platforms"
          :disabled="isSendingRequest || readonly"
        />
        <UsersSection
          v-model="users"
          :max="data?.maxTestGroupsCount || undefined"
          :disabled="isSendingRequest"
          :loading="isLoadingForUpdate"
          :nav-id="userSelectionNavId"
          :readonly
        />
        <ActionsSection
          v-if="isUpdateMode && !readonly"
          :disabled="isSendingRequest"
          @delete="handleDelete"
        />
      </PagePaddings>
    </PageContent>
    <template #bottomBar>
      <BottomBarTransition>
        <BottomBar v-if="showBottomBar">
          <PageContent>
            <BottomBarInner>
              <AutoButton
                :palette="isUrlValid && !isSendingRequest ? 'filled' : 'disabled'"
                :active="isUrlValid && !isSendingRequest"
                :disabled="!isUrlValid || isSendingRequest"
                full-width
                @click="isUrlValid && !isSendingRequest && handleButtonClick()"
              >
                <AutoTypography variant="body" weight="medium">
                  {{ t(isUrlValid
                      ? isUpdateMode
                        ? 'button.update'
                        : 'button.create'
                      : 'button.invalidUrl') }}
                </AutoTypography>
                <ButtonLoadingIndicator :show="isSendingRequest"/>
              </AutoButton>
            </BottomBarInner>
          </PageContent>
        </BottomBar>
      </BottomBarTransition>
    </template>
  </PageRoot>
</template>
