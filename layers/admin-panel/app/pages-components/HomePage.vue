<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';

import {
  IconApps30,
  IconLockFill28,
  IconPersonHanshakeFill28,
  IconTrades30,
  IconUserCircleFill28,
} from '#components';

import { usePageDataQueryOptions } from './_api/usePageDataQueryOptions';

const { data, isPending } = useQuery(usePageDataQueryOptions());
const { t } = useI18n({
  messages: {
    en: {
      apps: 'Applications',
      invites: 'Management Invites',
      transferRequests: 'App Transfer Requests',
      account: 'Account',
      privacy: 'Privacy and Security',
    },
    ru: {
      apps: 'Приложения',
      invites: 'Приглашения на управление',
      transferRequests: 'Трансферы приложений',
      account: 'Аккаунт',
      privacy: 'Приватность и безопасность',
    },
  },
});
const platform = useTmaPlatform();

const createIconComponent = <C extends Component>(component: C) => ({
  kind: 'component' as const,
  component,
});
const createCustomIconComponent = <C extends Component>(
  component: C,
  size: number,
  bgColor: ColorReferenceAnyColor,
) => ({
  kind: 'custom' as const,
  component,
  size,
  bgColor,
});
const sections = computed(() => {
  return [
    [{
      title: t('apps'),
      name: PAGE_NAME_APPS,
      icon: createIconComponent(IconApps30),
    }, {
      title: t('invites'),
      name: PAGE_NAME_MANAGEMENT_INVITES,
      icon: createCustomIconComponent(IconPersonHanshakeFill28, 20, '#FF9500'),
      count: data.value?.invitesCount,
      hasCounter: true,
    }, {
      title: t('transferRequests'),
      name: PAGE_NAME_TRANSFER_REQUESTS,
      icon: createIconComponent(IconTrades30),
      count: data.value?.transferRequestsCount,
      hasCounter: true,
    }],
    [{
      title: t('account'),
      name: PAGE_NAME_ACCOUNT,
      icon: createCustomIconComponent(IconUserCircleFill28, 24, '#FF3B30'),
    }, {
      title: t('privacy'),
      name: PAGE_NAME_PRIVACY,
      icon: createCustomIconComponent(IconLockFill28, 24, '#8E8E93'),
    }],
  ];
});

onMounted(() => {
  preloadRouteComponents({ name: PAGE_NAME_APPS });
  preloadRouteComponents({ name: PAGE_NAME_MANAGEMENT_INVITES });
  preloadRouteComponents({ name: PAGE_NAME_TRANSFER_REQUESTS });
  preloadRouteComponents({ name: PAGE_NAME_ACCOUNT });
  preloadRouteComponents({ name: PAGE_NAME_PRIVACY });
});
</script>

<template>
  <PageBase :back="false">
    <PageContent>
      <VerticalPaddings>
        <SidePaddings>
          <AutoSection
            v-for="(section, sectionIdx) in sections"
            :key="sectionIdx"
            :style="sectionIdx > 0 ? {marginTop: '16px'} : undefined"
            list-bg-color="secondary-bg"
          >
            <AutoList>
              <AutoListItem
                v-for="item in section"
                :key="item.name"
                clickable
                @click="navigateTo({name: item.name})"
              >
                <template #left>
                  <AutoListItemLeft>
                    <AutoListItemLeftIcon square>
                      <AutoListItemLeftIconElement
                        rounded
                        :style="item.icon.kind === 'custom' ? {
                          background: colorReference(item.icon.bgColor) || undefined,
                          color: 'white',
                        } : undefined"
                      >
                        <component
                          :is="item.icon.component"
                          :size="item.icon.kind === 'custom' ? item.icon.size : undefined"
                        />
                      </AutoListItemLeftIconElement>
                    </AutoListItemLeftIcon>
                  </AutoListItemLeft>
                </template>
                <template #bodyLeftLabel>
                  <AutoListItemBodyLeftLabel :max-lines="1">
                    {{ item.title }}
                  </AutoListItemBodyLeftLabel>
                </template>
                <template #bodyRight>
                  <AutoListItemBodyRight>
                    <ShimmerBox
                      v-if="'hasCounter' in item && item.count === undefined && isPending"
                      :width="24"
                      :height="24"
                      rounded
                    />
                    <AutoListItemBodyRightBadge v-else-if="'count' in item && item.count">
                      {{ item.count }}
                    </AutoListItemBodyRightBadge>
                    <AutoListItemBodyRightChevron v-if="platform.isMappedIos"/>
                  </AutoListItemBodyRight>
                </template>
              </AutoListItem>
            </AutoList>
          </AutoSection>
        </SidePaddings>
      </VerticalPaddings>
    </PageContent>
  </PageBase>
</template>
