<script setup lang="ts">
import * as fp from 'fp-ts';

import { InviteToManageDocument } from './operations';

const userSelectionStore = useUserSelectionStore();
const { t } = useI18n({
  messages: {
    en: {
      'selectedUser.title': 'Selected user',
      'role.title': 'Role',
      'role.admin.title': 'Admin',
      'role.admin.subtitle': 'Complete access over the application',
      'role.member.title': 'Member',
      'role.member.subtitle': 'Read-only access',
      invite: 'Invite',
    },
    ru: {
      'selectedUser.title': 'Выбранный пользователь',
      'role.title': 'Роль',
      'role.admin.title': 'Администратор',
      'role.admin.subtitle': 'Полный контроль над приложением',
      'role.member.title': 'Участник',
      'role.member.subtitle': 'Доступ только на чтение',
      invite: 'Пригласить',
    },
  },
});
const appId = useQueryAppId();
const platform = useTmaPlatform();
const isPageEntered = useIsCurrentPageEntered();
const router = useRouter();
const appManagersPageQueryMeta = useAppManagersPageQueryMeta();
const request = useMakeApiGqlRequest();
const { mutate: invite, isLoading } = useMutation({
  key: [InviteToManageDocument],
  mutation(options: {
    appId: number;
    userId: number;
    role: LocalAppManagementInviteRole;
  }) {
    return throwifyAnyEither(
      fp.function.pipe(
        request(InviteToManageDocument, {
          appId: options.appId,
          role: localAppManagementInviteRoleToApi(options.role),
          userId: options.userId,
        }),
        fp.taskEither.map(r => r.createAppManagementInvite),
      ),
    );
  },
  onSuccess({ from, id, role, to }, { appId }) {
    hapticNotificationOccurred('success');
    appManagersPageQueryMeta.setData(appId, prev => (
      prev
        ? {
          ...prev,
          invites: [...prev.invites, {
            id,
            role: apiAppManagementInviteRoleToLocal(role),
            from: from.name,
            to,
          }],
        }
        : prev
    ));
    router.go(-1);
  },
  onError() {
    hapticNotificationOccurred('error');
    // TODO: Popup
  },
});

const { e } = bem('app-manager-invite-page');
const user = userSelectionStore.selectedUsers![0]!;

const roles = computed(() => [{
  title: t('role.admin.title'),
  subtitle: t('role.admin.subtitle'),
  value: LocalAppManagementInviteRole.Admin,
}, {
  title: t('role.member.title'),
  subtitle: t('role.member.subtitle'),
  value: LocalAppManagementInviteRole.Member,
}]);
const role = ref(LocalAppManagementInviteRole.Admin);
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
                  {{ user.name }}
                </AutoListItemBodyLeftLabel>
              </template>
              <template #bodyRight>
                <AutoListItemBodyRight>
                  <AutoListItemBodyRightLabel>
                    #{{ user.id }}
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
              :class="e('role', platform.mapped)"
              :clickable="platform.isMappedAndroid"
              @click="role = item.value"
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
              <template #bodyRight>
                <AutoListItemBodyRight>
                  <RadioAndroid
                    v-if="platform.isMappedAndroid"
                    v-model="role"
                    :value="item.value"
                  />
                  <AutoListItemBodyRightCheckmark v-else-if="role === item.value"/>
                </AutoListItemBodyRight>
              </template>
            </AutoListItem>
          </AutoList>
        </AutoSection>
      </PagePaddings>
    </PageContent>
    <template #bottomBar>
      <BottomBarTransition>
        <BottomBar v-if="isPageEntered">
          <BottomBarInner>
            <AutoButton
              :palette="isLoading ? 'disabled' : 'filled'"
              full-width
              :active="!isLoading"
              :disabled="isLoading"
              @click="invite({role, userId: user.id, appId})"
            >
              <AutoTypography variant="body" weight="semibold">
                {{ t('invite') }}
              </AutoTypography>
              <ButtonLoadingIndicator :show="isLoading"/>
            </AutoButton>
          </BottomBarInner>
        </BottomBar>
      </BottomBarTransition>
    </template>
  </PageRoot>
</template>

<style lang="scss">
@use "@/scss/mixins";

.app-manager-invite-page {
  &__role {
    &--ios {
      @include mixins.clickable();
    }
  }
}
</style>
