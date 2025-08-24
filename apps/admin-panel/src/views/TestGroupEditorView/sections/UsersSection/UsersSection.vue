<script setup lang="ts">
import { hapticFeedbackSelectionChanged } from '@telegram-apps/sdk-vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import Link from '@/navigation/Link.vue';
import List from '@/ui/adapters/List';
import ListItem from '@/ui/adapters/ListItem';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel';
import ListItemBodyRightClear from '@/ui/adapters/ListItemBodyRightClear';
import type { SelectedUser } from '@/ui/components/UserSelectionView/UserSelectionView.vue';

import PlatformsText from './PlatformsText.vue';

const users = defineModel<SelectedUser[]>({ required: true });
const props = defineProps<{
  appId: number;
  maxCount?: number | null;
  canIncreaseLimits?: boolean;
  readonly?: boolean;
  disabled: boolean;
  platforms: string[];
  class?: string;
}>();
defineEmits<{ startSelecting: [] }>();

const { t } = useI18n({
  messages: {
    en: {
      title: 'Users ({current} / {max})',
      add: 'Add users',
      limitReached: 'Specified amount of users exceeds the allowed limit.',
      limitReachedPremium: 'To increase limits, you can purchase a {0}.',
      limitReachedPremiumSub: 'subscription',
    },
    ru: {
      title: 'Пользователи ({current} / {max})',
      add: 'Добавить пользователей',
      limitReached: 'Указанное количество пользователей превышает допустимый порог.',
      limitReachedPremium: 'Чтобы повысить лимиты, Вы можете приобрести {0}.',
      limitReachedPremiumSub: 'подписку',
    },
  },
});

const onUserDeleted = (user: SelectedUser) => {
  users.value = users.value.filter(u => u.id !== user.id);
  hapticFeedbackSelectionChanged();
};
const isLimitExceeded = computed(() => {
  return typeof props.maxCount === 'number'
    ? users.value.length > props.maxCount
    : false;
});
</script>

<template>
  <List
    :title="t('title', { current: users.length, max: maxCount ?? '∞' })"
    :class="$props.class"
  >
    <ListItem
      v-if="!readonly"
      :clickable="!disabled"
      variant="accent"
      @click="!disabled && $emit('startSelecting')"
    >
      <template #bodyLeftLabel>
        <ListItemBodyLeftLabel>{{ t('add') }}</ListItemBodyLeftLabel>
      </template>
    </ListItem>
    <template
      v-if="(!users.length && platforms.length) || isLimitExceeded"
      #footer
    >
      <template v-if="isLimitExceeded">
        {{ t('limitReached') }}
        <i18n-t
          v-if="canIncreaseLimits"
          keypath="limitReachedPremium"
        >
          <Link :to="`/apps/${appId}/premium`">
            {{ t('limitReachedPremiumSub') }}
          </Link>
        </i18n-t>
      </template>
      <PlatformsText
        v-else
        :platforms="platforms"
      />
    </template>
  </List>
  <List
    v-if="users.length"
    class="usersList"
  >
    <ListItem
      v-for="user in users"
      :key="user.id"
    >
      <template #bodyLeftLabel>
        <ListItemBodyLeftLabel>
          {{ user.name }} <span class="userId">#{{ user.id }}</span>
        </ListItemBodyLeftLabel>
      </template>
      <template
        v-if="!readonly"
        #bodyRightClear
      >
        <ListItemBodyRightClear @click="!disabled && onUserDeleted(user)" />
      </template>
    </ListItem>
    <template
      v-if="platforms.length"
      #footer
    >
      <PlatformsText :platforms="platforms" />
    </template>
  </List>
</template>

<style scoped>
.userId {
  color: var(--theme-subtitle-text-color);
}

.usersList {
  margin-top: 8px;
}
</style>
