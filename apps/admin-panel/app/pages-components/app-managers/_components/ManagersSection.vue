<script setup lang="ts">
interface Manager {
  id: number;
  name: string;
  role: string;
  isOwner: boolean;
}

const props = defineProps<{
  enabled?: boolean;
  readonly?: boolean;
  managers?: Manager[];
}>();
defineEmits<{
  invite: [];
  managerClick: [{ managerId: number }];
}>();

const { t } = useI18n({
  messages: {
    ru: {
      title: 'Менеджеры приложения',
      footer: 'У каждого менеджера есть роль, которая определяет уровень доступа в приложении. Чтобы назначить кого-либо менеджером, необходимо отправить приглашение на управление.',
      learnMore: 'Подробнее',
      invite: 'Пригласить на управление',
    },
    en: {
      title: 'Application managers',
      footer: 'Each manager has a role that defines their permissions for application management. To assign someone as a manager, you need to send them an invitation.',
      learnMore: 'Learn more',
      invite: 'Invite to manage',
    },
  },
});
const platform = useTmaPlatform();
const initiallyHadData = !!props.managers;

const isItemClickable = (item: Manager | number) => {
  return props.enabled
    && !props.readonly
    && typeof item === 'object'
    && !item.isOwner;
};
</script>

<template>
  <AutoSection list-bg-color="section-bg">
    <template #header>
      <AutoSectionHeader>
        {{ t('title') }}
      </AutoSectionHeader>
    </template>
    <AutoList>
      <AutoListItem
        :variant="enabled && !readonly ? 'accent' : 'placeholder'"
        :clickable="enabled && !readonly"
        @click="enabled && !readonly && $emit('invite')"
      >
        <template #bodyLeftLabel>
          <AutoListItemBodyLeftLabel>
            {{ t('invite') }}
          </AutoListItemBodyLeftLabel>
        </template>
      </AutoListItem>
      <TransitionGroup v-bind="createListItemTransition()" :css="false">
        <AutoListItem
          v-for="(managerOrWidth, idx) in managers || [180, 230]"
          :key="initiallyHadData && typeof managerOrWidth === 'object'
            ? managerOrWidth.id
            : idx"
          :clickable="isItemClickable(managerOrWidth)"
          large
          @click="
            isItemClickable(managerOrWidth)
            && typeof managerOrWidth === 'object'
            && $emit('managerClick', { managerId: managerOrWidth.id })
          "
        >
          <template #bodyLeftLabel>
            <AutoListItemBodyLeftLabel>
              <template v-if="typeof managerOrWidth === 'object'">
                {{ managerOrWidth.name }}
                <ColorBox as="span" text="subtitle-text">
                  #{{ managerOrWidth.id }}
                </ColorBox>
              </template>
              <TextShimmerBox v-else variant="body" :width="managerOrWidth"/>
            </AutoListItemBodyLeftLabel>
          </template>
          <template #bodyLeftSubtitle>
            <AutoListItemBodyLeftSubtitle>
              <template v-if="typeof managerOrWidth === 'object'">
                {{ managerOrWidth.role }}
              </template>
              <TextShimmerBox v-else :width="managerOrWidth / 3" variant="subheadline2"/>
            </AutoListItemBodyLeftSubtitle>
          </template>
          <template v-if="platform.isMappedIos && isItemClickable(managerOrWidth)" #bodyRight>
            <AutoListItemBodyRight>
              <AutoListItemBodyRightChevron/>
            </AutoListItemBodyRight>
          </template>
        </AutoListItem>
      </TransitionGroup>
    </AutoList>
    <template #footer>
      <AutoSectionFooter>
        {{ t('footer') }}
        <ExternalLink href="https://docs.mini-apps.store/management-system">
          {{ t('learnMore') }}
        </ExternalLink>
      </AutoSectionFooter>
    </template>
  </AutoSection>
</template>
