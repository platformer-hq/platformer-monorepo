<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { GearFillIOS28, Levels30 as LauncherIcon } from 'vue-ui';

import List from '@/ui/adapters/List.js';
import ListItem from '@/ui/adapters/ListItem.js';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel.js';
import ListItemBodyRightChevron from '@/ui/adapters/ListItemBodyRightChevron';
import ListItemLeftIcon from '@/ui/adapters/ListItemLeftIcon';
import ListItemIcon from '@/ui/components/ListItemIcon.vue';
import Page from '@/ui/components/Page.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';
import { createCustomListItemIcon } from '@/ui/helpers/createCustomListItemIcon';

const IntegrationIcon = createCustomListItemIcon(GearFillIOS28, 24, '#8E8E93');

const { t } = useI18n({
  messages: {
    en: {
      launcher: 'Launcher configuration',
      integration: 'Integration',
    },
    ru: {
      launcher: 'Настройка лаунчера',
      integration: 'Интеграция',
    },
  },
});
const router = useRouter();
const route = useRoute();
</script>

<template>
  <Page>
    <PagePaddings>
      <List>
        <ListItem
          v-for="(item, idx) in [
            { icon: IntegrationIcon, title: t('integration'), color: 'white', path: 'integration' },
            { icon: LauncherIcon, title: t('launcher'), color: '#007AFF', path: 'launcher' },
          ]"
          :key="idx"
          clickable
          @click="router.push(`${route.path}/${item.path}`)"
        >
          <template #leftIcon>
            <ListItemLeftIcon rounded>
              <ListItemIcon
                :is="item.icon"
                :color="item.color"
              />
            </ListItemLeftIcon>
          </template>
          <template #bodyLeftLabel>
            <ListItemBodyLeftLabel>
              {{ item.title }}
            </ListItemBodyLeftLabel>
          </template>
          <template #bodyRightChevron>
            <ListItemBodyRightChevron />
          </template>
        </ListItem>
      </List>
    </PagePaddings>
  </Page>
</template>
