<script setup lang="ts">
import { hapticFeedbackSelectionChanged } from '@telegram-apps/sdk-vue';
import { useI18n } from 'vue-i18n';

import List from '@/ui/adapters/List';
import ListItem from '@/ui/adapters/ListItem';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel';
import ListItemBodyRightCheckmark from '@/ui/adapters/ListItemBodyRightCheckmark';

const platformIds = defineModel<number[]>({ required: true });
defineProps<{
  platforms: { id: number; completeTitle: string }[];
  disabled: boolean;
}>();

const { t } = useI18n({
  messages: {
    en: {
      platformsTitle: 'Platforms',
      platformsFooter: 'Platforms which the test group is applicable to.',
    },
    ru: {
      platformsTitle: 'Платформы',
      platformsFooter: 'Платформы, к которым применима эта тестовая группа.',
    },
  },
});

const onPlatformClick = (platformId: number) => {
  if (platformIds.value.includes(platformId)) {
    platformIds.value = platformIds.value.filter(pId => pId !== platformId);
  } else {
    platformIds.value.push(platformId);
  }
  hapticFeedbackSelectionChanged();
};
</script>

<template>
  <List
    :title="t('platformsTitle')"
    :footer="t('platformsFooter')"
  >
    <ListItem
      v-for="platform in platforms"
      :key="platform.id"
      :clickable="!disabled"
      @click="!disabled && onPlatformClick(platform.id)"
    >
      <template #bodyLeftLabel>
        <ListItemBodyLeftLabel>{{ platform.completeTitle }}</ListItemBodyLeftLabel>
      </template>
      <template
        v-if="platformIds.includes(platform.id)"
        #bodyRightCheckmark
      >
        <ListItemBodyRightCheckmark />
      </template>
    </ListItem>
  </List>
</template>
