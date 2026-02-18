<script setup lang="ts">
import { AppPrivacy, AppRole } from 'schema';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import ListItem from '@/ui/adapters/ListItem.js';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel.js';
import ListItemBodyRightChevron from '@/ui/adapters/ListItemBodyRightChevron.js';
import ListItemBodyRightLabel from '@/ui/adapters/ListItemBodyRightLabel.js';

import type { DataQuery } from './operations.js';

const { showRole } = defineProps<{
  apps: DataQuery['currentUser']['apps'];
  showRole?: boolean;
}>();

const router = useRouter();
const { t } = useI18n({
  messages: {
    en: {
      admin: 'Admin',
      member: 'Manager',
      owner: 'Owner',
      private: 'Private',
      public: 'Public',
    },
    ru: {
      admin: 'Администратор',
      member: 'Менеджер',
      owner: 'Владелец',
      private: 'Приватное',
      public: 'Публичное',
    },
  },
});

function getRightLabel(role: AppRole, privacy: AppPrivacy) {
  return t(
    showRole
      ? ({
        [AppRole.Owner]: 'owner',
        [AppRole.Member]: 'member',
        [AppRole.Admin]: 'admin',
      } as const)[role]
      : ({
        [AppPrivacy.Hidden]: 'private',
        [AppPrivacy.Visible]: 'public',
      } as const)[privacy],
  );
}
</script>

<template>
  <ListItem
    v-for="{ app, role } in apps"
    :key="app.id"
    clickable
    @click="router.push(`/apps/${app.id.toString()}`)"
  >
    <template #bodyLeftLabel>
      <ListItemBodyLeftLabel>
        {{ app.title }}
      </ListItemBodyLeftLabel>
    </template>
    <template #bodyRightLabel>
      <ListItemBodyRightLabel>
        {{ getRightLabel(role, app.privacy) }}
      </ListItemBodyRightLabel>
    </template>
    <template #bodyRightChevron>
      <ListItemBodyRightChevron />
    </template>
  </ListItem>
</template>
