<script setup lang="ts">
const { t } = useI18n({
  messages: {
    en: {
      title: 'App management invites',
      'invite.subtitle': 'From {name} → {role}',
      'role.admin': 'Admin',
      'role.member': 'Member',
      empty: 'You have no management invites',
    },
    ru: {
      title: 'Приглашения на управление приложением',
      'invite.subtitle': 'От {name} → {role}',
      'role.admin': 'Админ',
      'role.member': 'Участник',
      empty: 'У Вас нет приглашений на управление',
    },
  },
});

const { data } = useQuery(useManagementInvitesPageQueryMeta().options);
const initialData = data.value;
const hasInitialData = !!initialData;

const invites = computed(() => {
  if (!data.value) {
    return [210, 180, 160].map((width, idx) => ({ kind: 'width' as const, key: idx, width }));
  }
  if (!data.value.length) {
    return [{ kind: 'empty' as const, key: initialData?.[0]?.id || 0 }];
  }
  return data.value.map((invite, idx) => ({
    kind: 'invite' as const,
    key: hasInitialData ? invite.id : idx,
    invite,
  }));
});

watch(invites, invites => {
  if (invites[0]?.kind === 'invite') {
    preloadRouteComponents({ name: PageNames.ManagementInvite });
  }
});
</script>

<template>
  <PageRoot colors="secondary-bg">
    <PageContent>
      <PagePaddings>
        <AutoSection list-bg-color="section-bg">
          <template #header>
            <AutoSectionHeader>
              {{ t('title') }}
            </AutoSectionHeader>
          </template>
          <TransitionGroup :css="false" v-bind="createListItemTransition()">
            <AutoListItem
              v-for="item in invites"
              :key="item.key"
              :large="item.kind !== 'empty'"
              :clickable="item.kind === 'invite'"
              @click="item.kind === 'invite' && navigateTo({
                name: PageNames.ManagementInvite,
                query: {
                  inviteId: item.invite.id,
                  app: JSON.stringify({
                    id: item.invite.app.id,
                    title: item.invite.app.title,
                  }),
                  sender: JSON.stringify({
                    id: item.invite.from.id,
                    name: item.invite.from.name,
                  }),
                  role: item.invite.role,
                },
              })"
            >
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  <template v-if="item.kind === 'invite'">
                    {{ item.invite.app.title }}
                    <ColorBox as="span" text="subtitle-text">
                      #{{ item.invite.app.id }}
                    </ColorBox>
                  </template>
                  <TextShimmerBox v-else-if="item.kind === 'width'" :width="item.width"/>
                  <template v-else>
                    {{ t('empty') }}
                  </template>
                </AutoListItemBodyLeftLabel>
              </template>
              <template #bodyLeftSubtitle>
                <AutoListItemBodyLeftSubtitle :max-lines="1">
                  <template v-if="item.kind === 'invite'">
                    {{ t('invite.subtitle', {
                      name: `${item.invite.from.name} #${item.invite.from.id}`,
                      role: {
                        [LocalAppManagementInviteRole.Admin]: t('role.admin'),
                        [LocalAppManagementInviteRole.Member]: t('role.member'),
                      }[item.invite.role]
                    }) }}
                  </template>
                  <TextShimmerBox v-else-if="item.kind === 'width'" :width="item.width / 2"/>
                </AutoListItemBodyLeftSubtitle>
              </template>
              <template v-if="item.kind === 'invite'" #bodyRight>
                <AutoListItemBodyRight>
                  <AutoListItemBodyRightChevron/>
                </AutoListItemBodyRight>
              </template>
            </AutoListItem>
          </TransitionGroup>
        </AutoSection>
      </PagePaddings>
    </PageContent>
  </PageRoot>
</template>
