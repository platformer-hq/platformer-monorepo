<script setup lang="ts">
defineProps<{
  disabled: boolean;
  max?: number;
  navId: number;
  readonly: boolean;
}>();

const users = defineModel<{ id: number; name: string }[]>({ required: true });

const { t } = useI18n({
  messages: {
    en: {
      title: 'Users',
      add: 'Add users',
      empty: 'No users selected',
      footer: 'A list of users to which this test group URL will be applied',
    },
    ru: {
      title: 'Пользователи',
      add: 'Добавить пользователей',
      empty: 'Пользователи не выбраны',
      footer: 'Список пользователей, к которым будет применён URL тестовой группы',
    },
  },
});
const navigateToUserSelection = useNavigateToUserSelection();
</script>

<template>
  <AutoSection list-bg-color="section-bg" style="margin-top: 16px">
    <template #header>
      <AutoSectionHeader>
        {{ t('title') }}
      </AutoSectionHeader>
    </template>
    <AutoList>
      <TransitionGroup v-bind="createListItemTransition()" :css="false">
        <AutoListItem v-if="!users.length && readonly" key="empty">
          <template #bodyLeftLabel>
            <AutoListItemBodyLeftLabel>
              {{ t('empty') }}
            </AutoListItemBodyLeftLabel>
          </template>
        </AutoListItem>
        <AutoListItem
          v-else-if="!readonly"
          key="add"
          :variant="disabled ? 'placeholder' : 'accent'"
          :clickable="!disabled"
          @click="!disabled && navigateToUserSelection({
            navId,
            alwaysShowConfirm: true,
            limit: max,
            selectedUsers: users,
          })"
        >
          <template #bodyLeftLabel>
            <AutoListItemBodyLeftLabel>
              {{ t('add') }}
            </AutoListItemBodyLeftLabel>
          </template>
        </AutoListItem>
        <AutoListItem v-for="user in users" :key="user.id">
          <template #bodyLeftLabel>
            <AutoListItemBodyLeftLabel>
              {{ user.name }}
              <ColorBox as="span" text="subtitle-text">
                #{{ user.id }}
              </ColorBox>
            </AutoListItemBodyLeftLabel>
          </template>
          <template v-if="!disabled && !readonly" #bodyRight>
            <AutoListItemBodyRight>
              <AutoListItemBodyRightClear
                @click="users = users.filter(u => u.id !== user.id)"
              />
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
</template>
