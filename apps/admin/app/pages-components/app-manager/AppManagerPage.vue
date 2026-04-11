<script setup lang="ts">
import { popup } from '@tma.js/sdk-vue';
import * as v from 'valibot';

import { RemoveManagerDocument, UpdateManagerDocument } from './operations';

const { query } = useParsedQuery({
  appId: v.pipe(v.string(), v.transform(Number)),
  user: {
    schema: v.pipe(
      v.string(),
      v.parseJson(),
      v.looseObject({
        id: v.number(),
        name: v.string(),
      }),
    ),
    serialize: JSON.stringify,
  },
  role: v.enum(LocalAppManagementInviteRole),
});

const { t } = useI18n({
  messages: {
    en: {
      'selectedUser.title': 'Selected user',
      'role.title': 'Role',
      'role.admin.title': 'Admin',
      'role.admin.subtitle': 'Complete access over the application',
      'role.member.title': 'Member',
      'role.member.subtitle': 'Read-only access',
      remove: 'Remove manager',
      'removeConfirmPopup.title': 'Confirm manager removal',
      'removeConfirmPopup.message': 'Are you sure you want to remove the manager? This action is irreversible.',
      'removeConfirmPopup.button.cancel': 'Cancel',
      'removeConfirmPopup.button.confirm': 'Remove',
      'button.update': 'Save',
    },
    ru: {
      'selectedUser.title': 'Выбранный пользователь',
      'role.title': 'Роль',
      'role.admin.title': 'Администратор',
      'role.admin.subtitle': 'Полный контроль над приложением',
      'role.member.title': 'Участник',
      'role.member.subtitle': 'Доступ только на чтение',
      remove: 'Удалить менеджера',
      'removeConfirmPopup.title': 'Подтвердите удаление менеджера',
      'removeConfirmPopup.message': 'Вы уверены, что хотите удалить менеджера? Это действие необратимо.',
      'removeConfirmPopup.button.cancel': 'Отмена',
      'removeConfirmPopup.button.confirm': 'Удалить',
      'button.update': 'Сохранить',
    },
  },
});
const platform = useTmaPlatform();
const isPageEntered = useIsCurrentPageEntered();
const router = useRouter();
const appManagersPageQueryMeta = useAppManagersPageQueryMeta();

//#region Requests.
const request = useMakeApiGqlRequest();
const { mutate: removeManager, isLoading: isDeletingManager } = useMutation({
  key: [RemoveManagerDocument],
  mutation(options: { appId: number; userId: number }) {
    return throwifyAnyEither(
      request(RemoveManagerDocument, { appId: options.appId, userId: options.userId }),
    );
  },
  onSuccess(_, { appId, userId }) {
    hapticNotificationOccurred('success');
    appManagersPageQueryMeta.setData(appId, prev => (
      prev
        ? { ...prev, managers: prev.managers.filter(m => m.user.id !== userId) }
        : prev
    ));
    router.back();
  },
  onError() {
    hapticNotificationOccurred('error');
    // TODO: Popup
  },
});
const { mutate: updateManager, isLoading: isUpdatingManager } = useMutation({
  key: [UpdateManagerDocument],
  mutation(options: { appId: number; role: LocalAppManagementInviteRole; userId: number }) {
    return throwifyAnyEither(
      request(UpdateManagerDocument, {
        appId: options.appId,
        userId: options.userId,
        role: localAppManagementInviteRoleToApi(options.role),
      }),
    );
  },
  onSuccess(_, { appId, userId, role: varsRole }) {
    hapticNotificationOccurred('success');
    appManagersPageQueryMeta.setData(appId, prev => (
      prev
        ? {
          ...prev,
          managers: prev.managers.map(m => (
            m.user.id === userId
              ? {
                ...m,
                role: {
                  [LocalAppManagementInviteRole.Admin]: LocalAppRole.Admin,
                  [LocalAppManagementInviteRole.Member]: LocalAppRole.Member,
                }[varsRole],
              }
              : m
          )),
        }
        : prev
    ));
    router.back();
  },
  onError() {
    hapticNotificationOccurred('error');
    // TODO: Popup
  },
});
//#endregion

const { e } = bem('app-manager-page');

const isSendingRequest = computed(() => isDeletingManager.value || isUpdatingManager.value);
const roles = computed(() => [{
  title: t('role.admin.title'),
  subtitle: t('role.admin.subtitle'),
  value: LocalAppManagementInviteRole.Admin,
}, {
  title: t('role.member.title'),
  subtitle: t('role.member.subtitle'),
  value: LocalAppManagementInviteRole.Member,
}]);
const role = ref(query.value.role);

const handleRemoveManager = async () => {
  const response = await popup.show({
    title: t('removeConfirmPopup.title'),
    message: t('removeConfirmPopup.message'),
    buttons: [
      { id: 'no', type: 'default', text: t('removeConfirmPopup.button.cancel') },
      { id: 'yes', type: 'destructive', text: t('removeConfirmPopup.button.confirm') },
    ],
  });
  if (response === 'yes') {
    removeManager({
      userId: query.value.user.id,
      appId: query.value.appId,
    });
  }
};

watch(role, hapticSelectionChanged);
</script>

<template>
  <PageRoot colors="secondary-bg">
    <PageContent>
      <PagePaddings>
        <AutoSection list-bg-color="section-bg">
          <template #header>
            <AutoSectionHeader>
              {{ t('selectedUser.title') }}
            </AutoSectionHeader>
          </template>
          <AutoList>
            <AutoListItem>
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  {{ query.user.name }}
                </AutoListItemBodyLeftLabel>
              </template>
              <template #bodyRight>
                <AutoListItemBodyRight>
                  <AutoListItemBodyRightLabel>
                    #{{ query.user.id }}
                  </AutoListItemBodyRightLabel>
                </AutoListItemBodyRight>
              </template>
            </AutoListItem>
          </AutoList>
        </AutoSection>

        <AutoSection list-bg-color="section-bg" style="margin-top: 16px">
          <template #header>
            <AutoSectionHeader>
              {{ t('role.title') }}
            </AutoSectionHeader>
          </template>
          <AutoList>
            <AutoListItem
              v-for="item in roles"
              :key="item.value"
              large
              :variant="isSendingRequest ? 'placeholder' : undefined"
              :class="e('role', platform.mapped)"
              :clickable="platform.isMappedAndroid && !isSendingRequest"
              @click="!isSendingRequest && (role = item.value)"
            >
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  {{ item.title }}
                </AutoListItemBodyLeftLabel>
              </template>
              <template #bodyLeftSubtitle>
                <AutoListItemBodyLeftSubtitle>
                  {{ item.subtitle }}
                </AutoListItemBodyLeftSubtitle>
              </template>
              <template v-if="role === item.value" #bodyRight>
                <AutoListItemBodyRight>
                  <AutoListItemBodyRightCheckmark/>
                </AutoListItemBodyRight>
              </template>
            </AutoListItem>
          </AutoList>
        </AutoSection>

        <AutoSection style="margin-top: 16px" list-bg-color="destructive-opaque-bg">
          <AutoList>
            <AutoListItem
              variant="destructive"
              :clickable="!isSendingRequest"
              @click="!isSendingRequest && handleRemoveManager()"
            >
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  {{ t('remove') }}
                </AutoListItemBodyLeftLabel>
              </template>
            </AutoListItem>
          </AutoList>
        </AutoSection>
      </PagePaddings>
    </PageContent>
    <template #bottomBar>
      <BottomBarTransition>
        <BottomBar v-if="isPageEntered && query.role !== role">
          <BottomBarInner>
            <AutoButton
              :palette="isSendingRequest ? 'disabled' : 'filled'"
              full-width
              :active="!isSendingRequest"
              :disabled="isSendingRequest"
              @click="updateManager({role, userId: query.user.id, appId: query.appId})"
            >
              <AutoTypography variant="body" weight="semibold">
                {{ t('button.update') }}
              </AutoTypography>
              <ButtonLoadingIndicator :show="isSendingRequest"/>
            </AutoButton>
          </BottomBarInner>
        </BottomBar>
      </BottomBarTransition>
    </template>
  </PageRoot>
</template>

<style lang="scss">
@use "@/scss/mixins";

.app-manager-page {
  &__role {
    &--ios {
      @include mixins.clickable();
    }
  }
}
</style>
