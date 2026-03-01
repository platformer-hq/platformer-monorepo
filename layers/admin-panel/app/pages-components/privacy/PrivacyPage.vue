<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query';

import { usePageDataMutator, usePageDataQueryOptions, useUpdateMutationOptions } from './_api/api';

const { t } = useI18n({
  messages: {
    en: {
      'invites.title': 'App management',
      'invites.footer': 'Allows other users to invite you to manager their applications',
      'transfers.title': 'App transfers',
      'transfers.footer': 'Allows other users to send you transfer requests related to their applications',
      'button.save': 'Save',
    },
    ru: {
      'invites.title': 'Управление приложениями',
      'invites.footer': 'Разрешает другим пользователям приглашать Вас к управлению их приложениями',
      'transfers.title': 'Перенос приложений',
      'transfers.footer': 'Разрешает другим пользователям отправлять Вам запросы на передачу их приложений',
      'button.save': 'Сохранить',
    },
  },
});

const platform = useTmaPlatform();
const mutatePageData = usePageDataMutator();
const { data, isPending: isLoadingPageData } = useQuery(usePageDataQueryOptions());
const { mutate: updatePermissions, isPending: isUpdating } = useMutation({
  ...useUpdateMutationOptions(),
  onSuccess(_, variables) {
    hapticNotificationOccurred('success');
    mutatePageData(variables);
  },
  onError(error) {
    hapticNotificationOccurred('error');
    console.error(error);
    // TODO: Popup?
  },
});

const isLoading = computed(() => isLoadingPageData.value || isUpdating.value);
const canAcceptAppTransfers = ref(data.value?.canAcceptAppTransfers || false);
const canBeInvitedToManage = ref(data.value?.canBeInvitedToManage || false);

onMounted(() => {
  preloadRouteComponents({ name: PAGE_NAME_MAIN });
});

watch(data, data => {
  if (data) {
    canAcceptAppTransfers.value = data.canAcceptAppTransfers;
    canBeInvitedToManage.value = data.canBeInvitedToManage;
  }
});
</script>

<template>
  <PageBase>
    <PageContent>
      <VerticalPaddings>
        <SidePaddings>
          <AutoSection list-bg-color="secondary-bg">
            <AutoList>
              <AutoListItem
                :clickable="platform.isMappedAndroid && !isLoading"
                @click="platform.isMappedAndroid && !isLoading
                  ? (canAcceptAppTransfers = !canAcceptAppTransfers)
                  : undefined"
              >
                <template #bodyLeftLabel>
                  <AutoListItemBodyLeftLabel>
                    {{ t('invites.title') }}
                  </AutoListItemBodyLeftLabel>
                </template>
                <template #bodyRight>
                  <AutoListItemBodyRight>
                    <AutoSwitch
                      v-model:checked="canAcceptAppTransfers"
                      :disabled="isLoading"
                      @click="platform.isMappedAndroid ? $event.preventDefault() : undefined"
                    />
                  </AutoListItemBodyRight>
                </template>
              </AutoListItem>
            </AutoList>
            <template #footer>
              <AutoSectionFooter>
                {{ t('invites.footer') }}
              </AutoSectionFooter>
            </template>
          </AutoSection>

          <AutoSection list-bg-color="secondary-bg" style="margin-top: 16px;">
            <AutoList>
              <AutoListItem
                :clickable="platform.isMappedAndroid && !isLoading"
                @click="platform.isMappedAndroid && !isLoading
                  ? (canBeInvitedToManage = !canBeInvitedToManage)
                  : undefined"
              >
                <template #bodyLeftLabel>
                  <AutoListItemBodyLeftLabel>
                    {{ t('transfers.title') }}
                  </AutoListItemBodyLeftLabel>
                </template>
                <template #bodyRight>
                  <AutoListItemBodyRight>
                    <AutoSwitch
                      v-model:checked="canBeInvitedToManage"
                      :disabled="isLoading"
                      @click="platform.isMappedAndroid ? $event.preventDefault() : undefined"
                    />
                  </AutoListItemBodyRight>
                </template>
              </AutoListItem>
            </AutoList>
            <template #footer>
              <AutoSectionFooter>
                {{ t('transfers.footer') }}
              </AutoSectionFooter>
            </template>
          </AutoSection>
        </SidePaddings>
      </VerticalPaddings>
    </PageContent>
    <BottomBarEnterUpTransition>
      <BottomBar
        v-if="!isLoadingPageData && (
          data?.canAcceptAppTransfers !== canAcceptAppTransfers
          || data?.canBeInvitedToManage !== canBeInvitedToManage
        )"
      >
        <AutoButton
          :palette="isLoading ? 'disabled' : 'filled'"
          full-width
          elevated
          :disabled="isLoading"
          :active="!isLoading"
          @click="updatePermissions({
            canAcceptAppTransfers: canAcceptAppTransfers,
            canBeInvitedToManage: canBeInvitedToManage
          })"
        >
          <AutoTypography variant="body" weight="medium">
            {{ t('button.save') }}
          </AutoTypography>
        </AutoButton>
      </BottomBar>
    </BottomBarEnterUpTransition>
  </PageBase>
</template>
