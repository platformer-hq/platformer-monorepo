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
import { useAppTestGroupPageStore } from './_stores/useAppTestGroupPageStore';

const props = defineProps<{
  appId: number;
}>();

const { query, update: updateQuery } = useParsedQuery({
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
const userSelectionStore = useUserSelectionPageStore();
const pageStore = useAppTestGroupPageStore();

//#region Requests.
const { options: appTestGroupPageQueryOptions } = useAppTestGroupPageQueryMeta();
const { data, isLoading: isLoadingPageData } = useQuery(() => appTestGroupPageQueryOptions({
  appId: props.appId,
  testGroupId: query.value.testGroupId || undefined,
}));
const {
  mutate: deleteTestGroup,
  isLoading: isDeletingTestGroup,
} = useDeleteTestGroup(props.appId);
const {
  mutate: updateTestGroup,
  isLoading: isUpdatingTestGroup,
} = useUpdateTestGroup(props.appId);
const { mutate: createTestGroup, isLoading: isCreatingTestGroup } = useCreateTestGroup();
const isSendingMutationRequest = computed(() => (
  isUpdatingTestGroup.value
  || isCreatingTestGroup.value
  || isDeletingTestGroup.value
));
const isSendingAnyRequest = computed(() => (
  isLoadingPageData.value || isSendingMutationRequest.value
));
// const isSendingAnyRequest = computed(() => true);
//#endregion

const userSelectionNavId = query.value.userSelectionNavId || Math.random();

const isReadonlyMode = computed(() => (
  !!data.value?.currentUserRole && !isEditorRole(data.value.currentUserRole)
));
// const isReadonlyMode = computed(() => true);
const isUrlValid = computed(() => isValidUrl(pageStore.url));
const isUpdateMode = computed(() => typeof query.value.testGroupId === 'number');
const showBottomBar = computed(() => {
  if (!isPageEntered.value || !data.value || isReadonlyMode.value) {
    return false;
  }
  if (!data.value.testGroup) {
    return true;
  }
  const prev = data.value.testGroup;
  return prev.enabled !== pageStore.enabled
    || prev.title !== pageStore.title
    || prev.url !== pageStore.url
    || prev.users.length !== pageStore.users.length
    || prev.users.some(u1 => pageStore.users.every(u2 => u1.id !== u2.id))
    || prev.platformIds.length !== pageStore.platformIds.length
    || prev.platformIds.some(platformId => !pageStore.platformIds.includes(platformId));
});

const handleButtonClick = () => {
  const shared = {
    enabled: pageStore.enabled,
    title: pageStore.title,
    platformIds: pageStore.platformIds,
    url: pageStore.url,
    userIds: pageStore.users.map(user => user.id),
  };
  if (query.value.testGroupId) {
    updateTestGroup({ ...shared, testGroupId: query.value.testGroupId });
  } else {
    createTestGroup({ ...shared, appId: props.appId });
  }
};
const handleDelete = () => {
  if (query.value.testGroupId) {
    deleteTestGroup({ testGroupId: query.value.testGroupId });
  }
};

// We should update local data only if we hadn't it before, or we had, but
// the user didn't come from the user selection page. Otherwise, we will
// overwrite his changes.
// TODO: This one should be improved. Not sure about this logic.
// I guess, changes will be lost if the user just refreshes the page. The store
// values will be just overwritten. Maybe use some kind of "isDirty" flag?
watch(() => ({
  testGroup: data.value?.testGroup,
  isFromUserSelection: !!query.value.userSelectionNavId
    && userSelectionStore.navId === query.value.userSelectionNavId,
  userSelection: userSelectionStore.selectedUsers || [],
}), ({ testGroup, userSelection, isFromUserSelection }) => {
  if (!testGroup) {
    return;
  }
  if (isFromUserSelection) {
    pageStore.setUsers(userSelection);
  } else {
    pageStore.setEnabled(testGroup.enabled);
    pageStore.setTitle(testGroup.title);
    pageStore.setUrl(testGroup.url);
    pageStore.setPlatformIds(testGroup.platformIds);
    pageStore.setUsers(testGroup.users);
  }
}, { immediate: true, deep: true });

onMounted(() => {
  updateQuery({ userSelectionNavId }, { replace: true });
});

watch(() => pageStore.url, console.warn);
</script>

<template>
  <PageRoot colors="secondary-bg">
    <PageContent>
      <PagePaddings>
        <EnabledSection
          :model-value="pageStore.enabled"
          :disabled="isSendingAnyRequest || isReadonlyMode"
          @update:model-value="pageStore.setEnabled"
        />
        <TitleSection
          :model-value="pageStore.title"
          :shimmer-enabled="isUpdateMode"
          :readonly="isReadonlyMode"
          :refreshing="isLoadingPageData"
          :disabled="isSendingAnyRequest"
          @update:model-value="pageStore.setTitle($event.trim())"
        />
        <UrlSection
          :model-value="pageStore.url"
          :shimmer-enabled="isUpdateMode"
          :readonly="isReadonlyMode"
          :refreshing="isLoadingPageData"
          :disabled="isSendingAnyRequest"
          @update:model-value="pageStore.setUrl($event.trim())"
        />
        <HttpWarning :show="pageStore.url.startsWith('http:')"/>
        <PlatformsSection
          :model-value="pageStore.platformIds"
          :platforms="data?.platforms"
          :readonly="isReadonlyMode"
          :disabled="isSendingAnyRequest"
          @update:model-value="pageStore.setPlatformIds($event)"
        />
        <UsersSection
          :model-value="pageStore.users"
          :max="data?.maxTestGroupsCount || undefined"
          :disabled="isSendingAnyRequest"
          :nav-id="userSelectionNavId"
          :readonly="isReadonlyMode"
          @update:model-value="pageStore.setUsers($event)"
        />
        <ActionsSection
          v-if="isUpdateMode && !isReadonlyMode"
          :disabled="isSendingAnyRequest"
          @delete="handleDelete"
        />
      </PagePaddings>
    </PageContent>
    <template #footer>
      <BottomBarTransition>
        <BottomBar v-if="showBottomBar">
          <PageContent>
            <BottomBarInner>
              <AutoButton
                :palette="isUrlValid && !isSendingAnyRequest ? 'filled' : 'disabled'"
                :active="isUrlValid && !isSendingAnyRequest"
                :disabled="!isUrlValid || isSendingAnyRequest"
                full-width
                elevated
                @click="isUrlValid && !isSendingAnyRequest && handleButtonClick()"
              >
                <AutoTypography variant="body" weight="medium">
                  {{ t(isUrlValid
                      ? isUpdateMode
                        ? 'button.update'
                        : 'button.create'
                      : 'button.invalidUrl') }}
                </AutoTypography>
                <ButtonLoadingIndicator :show="isSendingMutationRequest"/>
              </AutoButton>
            </BottomBarInner>
          </PageContent>
        </BottomBar>
      </BottomBarTransition>
    </template>
  </PageRoot>
</template>
