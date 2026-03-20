<script setup lang="ts">
import { popup } from '@tma.js/sdk-vue';

const { t } = useI18n({
  messages: {
    en: {
      title: 'Test groups',
      create: 'Create test group',
      'testGroup.platforms': '{count} platforms | {count} platform | {count} platforms',
      'testGroup.users': '{count} users | {count} user | {count} users',
      'testGroup.enabled': 'Enabled',
      'testGroup.disabled': 'Disabled',
      'testGroup.noTitle': '(empty title)',
      footer: 'Test groups are collections of users for specific platforms, each assigned a unique URL for the app.',
      learnMore: 'Learn more',
      'popup.message': 'You\'ve reached your test groups limit for this application.',
    },
    ru: {
      title: 'Тестовые группы',
      create: 'Создать тестовую группу',
      'testGroup.platforms': '{count} платформ | {count} платформа | {count} платформы | {count} платформ',
      'testGroup.users': '{count} пользователей | {count} пользователь | {count} пользователя | {count} пользователей',
      'testGroup.enabled': 'Включена',
      'testGroup.disabled': 'Отключена',
      'testGroup.noTitle': '(названия нет)',
      footer: 'Тестовые группы – коллекции пользователей на конкретных платформах, каждой из которых присвоена своя ссылка на приложение.',
      learnMore: 'Подробнее',
      'popup.message': 'Вы достигли лимита тестовых групп для данного приложения.',
    },
  },
});

const query = useAppTestGroupsPageQueryMeta();
const appId = useQueryAppId();
const { data } = useQuery(() => query.options(appId.value));
const hadInitialData = !!data.value;

const readonly = computed(() => !data.value || !isEditorRole(data.value.currentUserRole));
const handleCreate = async () => {
  if (!data.value) {
    return;
  }
  const { maxTestGroupsCount } = data.value;
  if (typeof maxTestGroupsCount === 'number' && data.value.testGroups.length >= maxTestGroupsCount) {
    await popup.show({ message: t('popup.message') });
    return;
  }
  navigateTo({
    name: PageNames.AppTestGroup,
    query: { appId: appId.value },
  });
};

watch(() => data.value?.testGroups, testGroups => {
  if (testGroups?.length) {
    preloadRouteComponents({ name: PageNames.AppTestGroup });
  }
});

onMounted(() => {
  preloadRouteComponents({ name: PageNames.App });
});
</script>

<template>
  <PageRoot colors="secondary-bg">
    <PageContent>
      <PagePaddings>
        <AutoSection list-bg-color="section-bg">
          <template #header>
            <AutoSectionHeader>
              {{ t('title') }}
              <template v-if="data">
                ({{ data.testGroups.length }} / {{ data.maxTestGroupsCount ?? '∞' }})
              </template>
              <TextShimmerBox
                v-else
                as="span"
                display="inline-block"
                variant="subheadline1"
                :width="40"
                margin="0 0 0 5px"
              />
            </AutoSectionHeader>
          </template>
          <AutoList>
            <AutoListItem
              :clickable="!!data && !readonly"
              :variant="data && !readonly ? 'accent' : 'placeholder'"
              @click="data && !readonly && handleCreate()"
            >
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  {{ t('create') }}
                </AutoListItemBodyLeftLabel>
              </template>
            </AutoListItem>
            <TransitionGroup v-bind="createListItemTransition()" :css="false">
              <AutoListItem
                v-for="(itemOrWidth, idx) in data?.testGroups || [210, 180, 160]"
                :key="hadInitialData && typeof itemOrWidth === 'object'
                  ? itemOrWidth.id
                  : idx"
                large
                :clickable="typeof itemOrWidth === 'object'"
                @click="typeof itemOrWidth === 'object' && navigateTo({
                  name: PageNames.AppTestGroup,
                  query: {
                    appId,
                    testGroupId: itemOrWidth.id
                  }
                })"
              >
                <template #bodyLeftLabel>
                  <AutoListItemBodyLeftLabel>
                    <template v-if="typeof itemOrWidth === 'object'">
                      {{ itemOrWidth.title || t('testGroup.noTitle') }}
                    </template>
                    <TextShimmerBox v-else variant="body" :width="itemOrWidth"/>
                  </AutoListItemBodyLeftLabel>
                </template>
                <template #bodyLeftSubtitle>
                  <AutoListItemBodyLeftSubtitle>
                    <template v-if="typeof itemOrWidth === 'object'">
                      {{ t('testGroup.platforms', { count: itemOrWidth.platformsCount }) }} ·
                      {{ t('testGroup.users', { count: itemOrWidth.usersCount }) }}
                    </template>
                    <TextShimmerBox v-else variant="subheadline1" :width="itemOrWidth / 2"/>
                  </AutoListItemBodyLeftSubtitle>
                </template>
                <template #bodyRight>
                  <AutoListItemBodyRight>
                    <AutoListItemBodyRightLabel>
                      <template v-if="typeof itemOrWidth === 'object'">
                        {{ itemOrWidth.enabled ? t('testGroup.enabled') : t('testGroup.disabled') }}
                      </template>
                      <TextShimmerBox v-else variant="body" :width="80"/>
                    </AutoListItemBodyRightLabel>
                    <WhenIos v-if="typeof itemOrWidth === 'object'">
                      <AutoListItemBodyRightChevron/>
                    </WhenIos>
                  </AutoListItemBodyRight>
                </template>
              </AutoListItem>
            </TransitionGroup>
          </AutoList>
          <template #footer>
            <AutoSectionFooter>
              {{ t('footer') }}
              <ExternalLink href="https://docs.mini-apps.store/test-groups">
                {{ t('learnMore') }}
              </ExternalLink>
            </AutoSectionFooter>
          </template>
        </AutoSection>
      </PagePaddings>
    </PageContent>
  </PageRoot>
</template>
