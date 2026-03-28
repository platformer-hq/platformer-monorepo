<script setup lang="ts">
import { useQuery } from '@pinia/colada';
import { popup } from '@tma.js/sdk-vue';

import { useAppsPageQueryMeta } from './composables/useAppsPageQueryMeta';

const { data, isPending } = useQuery(useAppsPageQueryMeta().options);
const platform = useTmaPlatform();
const { t } = useI18n({
  messages: {
    en: {
      'ownedApps.title': 'Your applications',
      'ownedApps.create': 'Create application',
      'ownedApps.footer': 'Applications owned by you',
      'app.privacy.public': 'Public',
      'app.role.admin': 'Admin',
      'app.role.member': 'Member',
      'managedApps.title': 'Managed applications',
      'managedApps.footer': 'Applications you have access to as a manager',
      'popup.limitReached.message': 'You can\'t create more applications as the limit was reached',
    },
    ru: {
      'ownedApps.title': 'Ваши приложения',
      'ownedApps.create': 'Создать приложение',
      'ownedApps.footer': 'Приложения, которые принадлежат Вам',
      'app.privacy.public': 'Публичное',
      'app.role.admin': 'Админ',
      'app.role.member': 'Менеджер',
      'managedApps.title': 'Управляемые приложения',
      'managedApps.footer': 'Приложения, к которым Вы имеете доступ, будучи их менеджером',
      'popup.limitReached.message': 'Вы не можете создать приложение, так как достигли лимита',
    },
  },
});
const apps = computed(() => {
  if (!data.value) {
    return;
  }
  interface App {
    id: number;
    title: string;
    isPublic: boolean;
    role: 'owner' | 'admin' | 'member';
  }
  return [...data.value.apps]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .reduce((acc, app) => {
      acc[app.role === 'owner' ? 'owned' : 'managed'].push(app);
      return acc;
    }, {
      owned: [] as App[],
      managed: [] as App[],
    });
});
const canCreate = computed(() => {
  if (!apps.value || !data.value) {
    return false;
  }
  const { maxOwnedAppsCount } = data.value;
  return maxOwnedAppsCount === undefined || apps.value.owned.length < maxOwnedAppsCount;
});

const hasInitialData = !!apps.value;
const appTransition = createReversibleTransition({
  animatedProperties({ transition, el }) {
    return reverseTransitionKeyframesIfLeave({
      height: ['0px', el.clientHeight + 'px'],
      opacity: [0, 1],
    }, transition);
  },
  animationOptions: {
    duration: 300,
    easing: 'ease-out',
  },
});
const managedAppsTransition = createReversibleTransition({
  animatedProperties: {
    opacity: [0, 1],
    transform: ['scale(0.95)', 'scale(1)'],
  },
  animationOptions: {
    duration: 300,
    easing: 'ease-out',
  },
});
const handleCreateClick = async () => {
  if (!canCreate.value) {
    await popup.show({ message: t('popup.limitReached.message') });
  } else {
    navigateTo({ name: PageNames.CreateApp });
  }
};

watch(canCreate, value => {
  if (value) {
    preloadRouteComponents({ name: PageNames.CreateApp });
  }
});
watch(apps, apps => {
  if (apps?.owned?.length || apps?.managed.length) {
    preloadRouteComponents({ name: PageNames.App });
  }
});

onMounted(() => {
  preloadRouteComponents({ name: PageNames.Main });
});
</script>

<template>
  <PageRoot colors="secondary-bg">
    <PageContent>
      <PagePaddings>
        <AutoSection list-bg-color="section-bg">
          <template #header>
            <AutoSectionHeader>
              {{ t('ownedApps.title') }}
              <template v-if="apps && data">
                ({{ apps.owned.length }} / {{ data.maxOwnedAppsCount ?? '∞' }})
              </template>
              <TextShimmerBox
                v-else
                as="span"
                display="inline-block"
                variant="body"
                :width="40"
                margin="0 0 0 5px"
              />
            </AutoSectionHeader>
          </template>
          <AutoList>
            <AutoListItem
              :variant="isPending ? 'placeholder' : 'accent'"
              :clickable="!isPending"
              @click="handleCreateClick"
            >
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  {{ t('ownedApps.create') }}
                </AutoListItemBodyLeftLabel>
              </template>
            </AutoListItem>
            <TransitionGroup v-bind="appTransition" :css="false">
              <AutoListItem
                v-for="(appOrWidth, idx) in apps?.owned || ['40%', '70%', '60%']"
                :key="hasInitialData
                  ? typeof appOrWidth === 'object'
                    ? appOrWidth.id
                    : idx
                  : idx"
                :clickable="typeof appOrWidth === 'object'"
                @click="typeof appOrWidth === 'object' && navigateToApp(appOrWidth.id)"
              >
                <template #bodyLeftLabel>
                  <AutoListItemBodyLeftLabel
                    v-if="typeof appOrWidth === 'object'"
                    :max-lines="1"
                  >
                    {{ appOrWidth.title }}
                  </AutoListItemBodyLeftLabel>
                  <TextShimmerBox v-else variant="body" :width="appOrWidth"/>
                </template>
                <template v-if="typeof appOrWidth === 'object'" #bodyRight>
                  <AutoListItemBodyRight>
                    <AutoListItemBodyRightLabel v-if="appOrWidth?.isPublic">
                      {{ t('app.privacy.public') }}
                    </AutoListItemBodyRightLabel>
                    <AutoListItemBodyRightChevron v-if="platform.isMappedIos"/>
                  </AutoListItemBodyRight>
                </template>
              </AutoListItem>
            </TransitionGroup>
          </AutoList>
          <template #footer>
            <AutoSectionFooter>
              {{ t('ownedApps.footer') }}
            </AutoSectionFooter>
          </template>
        </AutoSection>

        <Transition v-bind="managedAppsTransition" :css="false">
          <AutoSection
            v-if="apps?.managed.length"
            list-bg-color="section-bg"
            :style="{marginTop: '16px'}"
          >
            <template #header>
              <AutoSectionHeader>
                {{ t('managedApps.title') }}
              </AutoSectionHeader>
            </template>
            <AutoList>
              <TransitionGroup v-bind="appTransition" :css="false">
                <AutoListItem
                  v-for="app in apps.managed"
                  :key="app.id"
                  clickable
                  @click="navigateToApp(app.id)"
                >
                  <template #bodyLeftLabel>
                    <AutoListItemBodyLeftLabel :max-lines="1">
                      {{ app.title }}
                    </AutoListItemBodyLeftLabel>
                  </template>
                  <template #bodyRight>
                    <AutoListItemBodyRight>
                      <AutoListItemBodyRightLabel>
                        {{ t(app.role === 'admin' ? 'app.role.admin' : 'app.role.member') }}
                      </AutoListItemBodyRightLabel>
                      <AutoListItemBodyRightChevron v-if="platform.isMappedIos"/>
                    </AutoListItemBodyRight>
                  </template>
                </AutoListItem>
              </TransitionGroup>
            </AutoList>
            <template #footer>
              <AutoSectionFooter>
                {{ t('managedApps.footer') }}
              </AutoSectionFooter>
            </template>
          </AutoSection>
        </Transition>
      </PagePaddings>
    </PageContent>
  </PageRoot>
</template>
