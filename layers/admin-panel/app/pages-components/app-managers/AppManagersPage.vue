<script setup lang="ts">
import InvitesSection from './_components/InvitesSection.vue';
import ManagersSection from './_components/ManagersSection.vue';
import { RevokeManageInviteDocument } from './operations';

const { t } = useI18n({
  messages: {
    ru: {
      'role.owner': 'Владелец',
      'role.admin': 'Админ',
      'role.member': 'Менеджер',
    },
    en: {
      'role.owner': 'Owner',
      'role.admin': 'Admin',
      'role.member': 'Member',
    },
  },
});
const navigateToUserSelection = useNavigateToUserSelection();
const appId = useQueryAppId();
const request = useMakeGqlApiRequest();
const queryMeta = useAppManagersPageQueryMeta();
const { data, isPending } = useQuery(() => queryMeta.options(appId.value));
const { mutate: revokeManageInvite, isLoading: isRevokingInvite } = useMutation({
  key: [RevokeManageInviteDocument],
  mutation(options: { inviteId: number }) {
    return throwifyAnyEither(request(RevokeManageInviteDocument, {
      inviteId: options.inviteId,
    }));
  },
  onSuccess(_, { inviteId }) {
    hapticNotificationOccurred('success');
    queryMeta.setData(appId.value, prev => (
      prev
        ? { ...prev, invites: prev.invites.filter(item => item.id !== inviteId) }
        : prev
    ));
  },
  onError() {
    hapticNotificationOccurred('error');
  },
  onSettled() {
    revokingInviteId.value = undefined;
  },
});

const revokingInviteId = ref<number>();
const isReadonly = computed(() => !data.value || !isEditorRole(data.value.currentUser.role));

const handleInvite = () => {
  navigateToUserSelection({
    canBeInvitedToManage: true,
    limit: 1,
    autoConfirmOnLimit: true,
    onConfirmAction: {
      kind: 'navigate-to',
      page: PageNames.AppManagerInvite,
      replace: true,
      query: {
        appId: appId.value,
      },
    },
    excludedUserIds: data.value
      ? [
        ...data.value.managers.map(m => m.user.id),
        ...data.value.invites.map(item => item.to.id),
      ]
      : [],
  });
};
const handleRemoveInvite = (id: number) => {
  revokeManageInvite({ inviteId: id });
  revokingInviteId.value = id;
};
const handleManagerClick = (managerId: number) => {
  const manager = data.value?.managers.find(m => m.user.id === managerId);
  if (manager) {
    navigateTo({
      name: PageNames.AppManager,
      query: {
        appId: appId.value,
        user: JSON.stringify({
          id: manager.user.id,
          name: manager.user.name,
        }),
        role: manager.role,
      },
    });
  }
};

watch(() => data.value?.currentUser.role, role => {
  if (role && isEditorRole(role)) {
    preloadRouteComponents({ name: PageNames.AppManagerInvite });
    preloadRouteComponents({ name: PageNames.AppManager });
  }
}, { immediate: true });

onMounted(() => {
  preloadRouteComponents({ name: PageNames.App });
});
</script>

<template>
  <PageRoot colors="secondary-bg">
    <PageContent>
      <PagePaddings>
        <ManagersSection
          :enabled="!isRevokingInvite && !isPending"
          :readonly="isReadonly"
          :managers="data?.managers.map(m => ({
            id: m.user.id,
            name: m.user.name,
            isOwner: m.role === 'owner',
            role: {
              owner: t('role.owner'),
              admin: t('role.admin'),
              member: t('role.member'),
            }[m.role],
          }))"
          @invite="handleInvite"
          @manager-click="handleManagerClick($event.managerId)"
        />

        <InvitesSection
          :enabled="!isRevokingInvite && !isPending"
          :readonly="isReadonly"
          :invites="data?.invites.map(invite => ({
            ...invite,
            role: {
              admin: t('role.admin'),
              member: t('role.member'),
            }[invite.role],
          }))"
          :revoking-invite-id="revokingInviteId"
          @remove="handleRemoveInvite($event.inviteId)"
        />
      </PagePaddings>
    </PageContent>
  </PageRoot>
</template>
