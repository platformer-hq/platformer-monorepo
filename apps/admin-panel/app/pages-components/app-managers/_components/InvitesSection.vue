<script setup lang="ts">
defineProps<{
  revokingInviteId?: number;
  readonly?: boolean;
  invites?: {
    id: number;
    from: string;
    role: string;
    to: {
      id: number;
      name: string;
    };
  }[];
}>();
defineEmits<{
  remove: [{ inviteId: number }];
}>();

const { t } = useI18n({
  messages: {
    ru: {
      title: 'Приглашения на управление',
      footer: 'Список активных приглашений на управление',
      'invite.subtitle': 'От {name} → {role}',
    },
    en: {
      title: 'Management invites',
      footer: 'List of pending management invites that should be accepted by the invitees',
      'invite.subtitle': 'From {name} → {role}',
    },
  },
});

const rootTransition = createReversibleTransition({
  animatedProperties: { opacity: [0, 1], transform: ['scale(0.98)', 'scale(1)'] },
  animationOptions: { duration: 200, easing: 'ease-out' },
});
const inviteRemoveTransition = createReversibleTransition({
  animatedProperties: { transform: ['scale(0.8)', 'scale(1.2)', 'scale(1)'], opacity: [0, 1] },
  animationOptions: { duration: 300, easing: 'ease-in-out' },
});
</script>

<template>
  <Transition v-bind="rootTransition" :css="false">
    <AutoSection v-if="invites?.length" list-bg-color="section-bg" style="margin-top: 16px">
      <template #header>
        <AutoSectionHeader>
          {{ t('title') }}
        </AutoSectionHeader>
      </template>
      <AutoList>
        <TransitionGroup v-bind="createListItemTransition()" :css="false">
          <AutoListItem v-for="invite in invites" :key="invite.id" large>
            <template #bodyLeftLabel>
              <AutoListItemBodyLeftLabel>
                {{ invite.to.name }}
                <ColorBox as="span" text="subtitle-text">
                  #{{ invite.to.id }}
                </ColorBox>
              </AutoListItemBodyLeftLabel>
            </template>
            <template #bodyLeftSubtitle>
              <AutoListItemBodyLeftSubtitle :max-lines="2">
                {{ t('invite.subtitle', { name: invite.from, role: invite.role }) }}
              </AutoListItemBodyLeftSubtitle>
            </template>
            <template v-if="!readonly" #bodyRight>
              <AutoListItemBodyRight>
                <Transition v-bind="inviteRemoveTransition" :css="false" mode="out-in">
                  <AutoLoadingIndicator
                    v-if="revokingInviteId === invite.id"
                    color="hint"
                    :size="18"
                  />
                  <AutoListItemBodyRightClear
                    v-else-if="revokingInviteId === undefined"
                    @click="$emit('remove', {inviteId: invite.id})"
                  />
                </Transition>
              </AutoListItemBodyRight>
            </template>
          </AutoListItem>
        </TransitionGroup>
      </AutoList>
      <template #footer>
        <AutoSectionFooter>
          {{ t('footer') }}
        </AutoSectionFooter>
      </template>
    </AutoSection>
  </Transition>
</template>
