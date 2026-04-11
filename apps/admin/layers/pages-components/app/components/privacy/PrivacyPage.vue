<script setup lang="ts">
import * as fp from 'fp-ts';

import { PrivacyPageDataDocument, UpdatePermissionsDocument } from './operations';

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
const request = useMakeApiGqlRequest();
const queryCache = useQueryCache();
const { data: pageData, isPending: isLoadingPageData } = useQuery({
  key: [PrivacyPageDataDocument],
  query: throwify(() => {
    return fp.function.pipe(
      request(PrivacyPageDataDocument, {}),
      fp.taskEither.map(({ currentUser }) => ({
        canAcceptAppTransfers: currentUser.canAcceptAppTransfers,
        canBeInvitedToManage: currentUser.canBeInvitedToManage,
      })),
    );
  }),
});
const { mutate: updatePermissions, isLoading: isUpdating } = useMutation({
  mutation(options: { canAcceptAppTransfers: boolean; canBeInvitedToManage: boolean }) {
    return throwifyAnyEither(
      request(UpdatePermissionsDocument, {
        canAcceptAppTransfers: options.canAcceptAppTransfers,
        canBeInvitedToManage: options.canBeInvitedToManage,
      }),
    );
  },
  onSuccess(_, variables) {
    hapticNotificationOccurred('success');
    queryCache.setQueryData([PrivacyPageDataDocument], {
      canAcceptAppTransfers: variables.canAcceptAppTransfers,
      canBeInvitedToManage: variables.canBeInvitedToManage,
    });
  },
  onError(error) {
    hapticNotificationOccurred('error');
    console.error(error);
    // TODO: Popup?
  },
});

const isLoading = computed(() => isLoadingPageData.value || isUpdating.value);
const canAcceptAppTransfers = ref(pageData.value?.canAcceptAppTransfers || false);
const canBeInvitedToManage = ref(pageData.value?.canBeInvitedToManage || false);

onMounted(() => {
  preloadRouteComponents({ name: PageNames.Main });
});

watch(pageData, data => {
  if (data) {
    canAcceptAppTransfers.value = data.canAcceptAppTransfers;
    canBeInvitedToManage.value = data.canBeInvitedToManage;
  }
});
</script>

<template>
  <PageRoot colors="secondary-bg">
    <PageContent>
      <PagePaddings>
        <AutoSection list-bg-color="section-bg">
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

        <AutoSection list-bg-color="section-bg" style="margin-top: 16px;">
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
      </PagePaddings>
    </PageContent>
    <template #bottomBar>
      <BottomBarTransition>
        <BottomBar
          v-if="!isLoadingPageData && (
            pageData?.canAcceptAppTransfers !== canAcceptAppTransfers
            || pageData?.canBeInvitedToManage !== canBeInvitedToManage
          )"
        >
          <BottomBarInner>
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
          </BottomBarInner>
        </BottomBar>
      </BottomBarTransition>
    </template>
  </PageRoot>
</template>
