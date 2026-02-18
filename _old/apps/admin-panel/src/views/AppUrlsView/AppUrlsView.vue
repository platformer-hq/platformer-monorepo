<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

import { useAppIDFromParams } from '@/navigation/useAppIDFromParams';
import { useMutationFn } from '@/queries/useMutationFn';
import { isEditorAppRole } from '@/roles/isEditorAppRole';
import Page from '@/ui/components/Page.vue';
import PageLoading from '@/ui/components/PageLoading.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';
import AppNotFoundView from '@/views/AppNotFoundView/AppNotFoundView.vue';

import { SetAppUrls, type SetAppUrlsMutation, type SetAppUrlsMutationVariables } from './operations';
import { setAppUrlsViewQueryData, useAppUrlsViewQueryOptions } from './query-options';
import ReadyLayout from './ReadyLayout.vue';

const appId = useAppIDFromParams();
const client = useQueryClient();
const { data: viewData } = useQuery(useAppUrlsViewQueryOptions(appId));
const {
  mutate: updateUrls,
  isPending: isUpdating,
} = useMutation<SetAppUrlsMutation, unknown, SetAppUrlsMutationVariables>({
  mutationFn: useMutationFn(SetAppUrls),
  onSuccess(response, vars) {
    setAppUrlsViewQueryData([vars.appID], client, prev => {
      if (prev?.app) {
        prev.app.urls = response.updateApp.urls;
        return prev;
      }
    });
  },
});

const onUpdate = (urls: { [PlatformId: number]: string }) => {
  updateUrls({
    appID: appId,
    urls: Object.entries(urls).map(([platformId, url]) => ({
      platformID: Number(platformId),
      url,
    })),
  });
};
</script>

<template>
  <Page
    preserve-main-button
    full-height
    :scrollbar="false"
  >
    <PagePaddings>
      <PageLoading v-if="!viewData" />
      <AppNotFoundView v-else-if="!viewData.app" />
      <ReadyLayout
        v-else
        :loading="isUpdating"
        :readonly="!isEditorAppRole(viewData.app.currentUserRole)"
        :urls="viewData.app.urls"
        :platforms="viewData.platforms"
        @update="onUpdate($event.urls)"
      />
    </PagePaddings>
  </Page>
</template>
