<script setup lang="ts">
import type { Component } from 'vue';

import { IconGearFillIOS28, IconLevels30 } from '#components';

const { t } = useI18n({
  messages: {
    ru: {
      integration: 'Интеграция',
      launcher: 'Настройка лаунчера',
    },
    en: {
      integration: 'Integration',
      launcher: 'Launcher configuration',
    },
  },
});
const platform = useTmaPlatform();
const appId = useQueryAppId();

const createCustomIcon = <C extends Component>(
  component: C,
  color: ColorReferenceAnyColor,
  bgColor: ColorReferenceAnyColor,
  size: number,
) => ({ kind: 'custom' as const, component, color, bgColor, size });
const createStaticIcon = <C extends Component>(component: C) => ({
  kind: 'static' as const,
  component,
});

const items = computed(() => [{
  title: t('integration'),
  page: PAGE_NAME_APP_TG_INTEGRATION,
  icon: createCustomIcon(IconGearFillIOS28, 'white', '#8E8E93', 24),
}, {
  title: t('launcher'),
  page: PAGE_NAME_APP_TG_LAUNCHER,
  icon: createStaticIcon(IconLevels30),
}]);

watch(items, items => {
  items.forEach(item => {
    preloadRouteComponents({ name: item.page });
  });
});
</script>

<template>
  <PageBase>
    <PageContent>
      <PagePaddings>
        <AutoSection list-bg-color="secondary-bg">
          <AutoList>
            <AutoListItem
              v-for="{icon, page, title} in items"
              :key="page"
              clickable
              @click="navigateTo({name: page, query: {appId}})"
            >
              <template #left>
                <AutoListItemLeft>
                  <AutoListItemLeftIcon>
                    <AutoListItemLeftIconElement
                        rounded
                        :style="'bgColor' in icon && {backgroundColor: icon.bgColor}"
                      >
                      <component
                        :is="icon.component"
                        :size="'size' in icon ? icon.size : undefined"
                        :color="'color' in icon ? icon.color : undefined"
                      />
                    </AutoListItemLeftIconElement>
                  </AutoListItemLeftIcon>
                </AutoListItemLeft>
              </template>
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  {{ title }}
                </AutoListItemBodyLeftLabel>
              </template>
              <template v-if="platform.isMappedIos" #bodyRight>
                <AutoListItemBodyRight>
                  <AutoListItemBodyRightChevron/>
                </AutoListItemBodyRight>
              </template>
            </AutoListItem>
          </AutoList>
        </AutoSection>
      </PagePaddings>
    </PageContent>
  </PageBase>
</template>
