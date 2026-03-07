<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query';
import { popup } from '@tma.js/sdk-vue';
import { taskEither, function as fn } from 'fp-ts';
import { looseObject, parse, pipe, string, transform } from 'valibot';

import {
  IconAdvancedSettings30,
  IconUsers30,
  IconTelegram24,
  IconSurveys30,
  IconPersonLineDottedFill28,
  IconLink30,
  IconEyeFillIOS28,
  IconDataAndStorage30,
} from '#components';

import AppIcon from './_components/AppIcon.vue';
import { AppPageDataDocument, DeleteAppDocument } from './operations';

const createIconComponent = <C extends Component>(component: C) => ({
  kind: 'component' as const,
  component,
});
const createCustomIconComponent = <C extends Component>(
  component: C,
  size: number,
  bgColor: ColorReferenceAnyColor,
) => ({ kind: 'custom' as const, component, size, bgColor });

const GeneralIcon = createIconComponent(IconAdvancedSettings30);
const ManagersIcon = createIconComponent(IconUsers30);
const TestGroupsIcon = createIconComponent(IconSurveys30);
const URLsIcon = createIconComponent(IconLink30);
const CacheIcon = createIconComponent(IconDataAndStorage30);
const TransferIcon = createCustomIconComponent(IconPersonLineDottedFill28, 22, '#34C759');
const TelegramIcon = createCustomIconComponent(IconTelegram24, 24, '#007AFF');
const UrlWizardIcon = createCustomIconComponent(IconEyeFillIOS28, 24, '#FF2D55');

const query = parse(
  looseObject({ appId: pipe(string(), transform(Number)) }),
  useRoute().query,
);
const { e } = bem('app-page');

const router = useRouter();
const { t } = useI18n({
  messages: {
    en: {
      'common.general': 'General',
      'common.managers': 'Managers',
      'common.urls': 'URLs',
      'common.testGroups': 'Test Groups',
      'common.transfer': 'Transfer',
      'integrations.title': 'Integrations',
      'integrations.tg': 'Telegram',
      'utils.title': 'Utilities',
      'utils.urlWizard': 'URL Wizard',
      'utils.cache': 'Caching',
      'popup.delete.title': 'Confirm app deletion',
      'popup.delete.message': 'Are you sure you want to delete the application? This action is irreversible.',
      'popup.delete.cancel': 'Cancel',
      'popup.delete.confirm': 'Delete',
      deleteApp: 'Delete application',
    },
    ru: {
      'common.general': 'Основная информация',
      'common.managers': 'Менеджеры',
      'common.urls': 'Ссылки',
      'common.testGroups': 'Тестовые группы',
      'common.transfer': 'Передача приложения',
      'integrations.title': 'Интеграции',
      'integrations.tg': 'Телеграм',
      'utils.title': 'Утилиты',
      'utils.urlWizard': 'Обозреватель ссылок',
      'utils.cache': 'Кеширование',
      'popup.delete.title': 'Подтвердите удаление приложения',
      'popup.delete.message': 'Вы уверены, что хотите удалить приложение? Это действие необратимо.',
      'popup.delete.cancel': 'Отмена',
      'popup.delete.confirm': 'Удалить',
      deleteApp: 'Удалить приложение',
    },
  },
});
const request = useMakeGqlApiRequest();
const queryKey = [AppPageDataDocument, query.appId] as const;
const { data: appData, isPending: isLoadingApp } = useQuery({
  queryKey,
  queryFn: throwify((data: { queryKey: typeof queryKey }) => {
    return fn.pipe(
      request({ document: data.queryKey[0], variables: { appID: data.queryKey[1] } }),
      taskEither.map(({ app }) => (
        app
          ? { id: app.id, title: app.title, role: apiAppRoleToLocal(app.currentUserRole) }
          : null
      )),
    );
  }),
});
const { mutate: deleteApp, isPending: isDeletingApp } = useMutation({
  mutationKey: [DeleteAppDocument],
  mutationFn: throwify((options: { appId: number }) => {
    return request({ document: DeleteAppDocument, variables: { appID: options.appId } });
  }),
  onSuccess() {
    hapticNotificationOccurred('success');
    router.back();
  },
  onError() {
    hapticNotificationOccurred('error');
    // TODO: Popup.
  },
});
const platform = useTmaPlatform();

const isSendingRequest = computed(() => isLoadingApp.value || isDeletingApp.value);
const sections = computed(() => [
  {
    items: [
      { icon: GeneralIcon, title: t('common.general'), name: PAGE_NAME_APP_GENERAL },
      { icon: ManagersIcon, title: t('common.managers'), name: PAGE_NAME_APP_MANAGERS },
      { icon: URLsIcon, title: t('common.urls'), name: PAGE_NAME_APP_URLS },
      { icon: TestGroupsIcon, title: t('common.testGroups'), name: PAGE_NAME_APP_TEST_GROUPS },
      { icon: TransferIcon, title: t('common.transfer'), name: PAGE_NAME_APP_TRANSFER },
    ],
  },
  {
    title: t('integrations.title'),
    items: [
      { icon: TelegramIcon, title: t('integrations.tg'), name: PAGE_NAME_APP_TG },
    ],
  },
  {
    title: t('utils.title'),
    items: [
      { icon: UrlWizardIcon, title: t('utils.urlWizard'), name: PAGE_NAME_APP_URL_VIEWER },
      { icon: CacheIcon, title: t('utils.cache'), name: PAGE_NAME_APP_CACHE },
    ],
  },
]);

const handleDelete = async () => {
  const response = await popup.show({
    title: t('popup.delete.title'),
    message: t('popup.delete.message'),
    buttons: [
      { id: 'no', type: 'default', text: t('popup.delete.cancel') },
      { id: 'yes', type: 'destructive', text: t('popup.delete.confirm') },
    ],
  });
  if (response === 'yes') {
    deleteApp({ appId: query.appId });
  }
};

onMounted(() => {
  preloadRouteComponents({ name: PAGE_NAME_APPS });
  sections.value.flatMap(s => s.items).forEach(item => {
    preloadRouteComponents({ name: item.name });
  });
});
</script>

<template>
  <PageBase>
    <PageContent>
      <PagePaddings>
        <AppIcon :class="e('icon')"/>
        <AutoTypography
          as="h1"
          variant="title1"
          :class="e('title')"
          weight="semibold"
        >
          <template v-if="appData">
            {{ appData.title }}
          </template>
          <TextShimmerBox v-else variant="title1" :width="130" display="inline-block"/>
          <ColorBox text="hint" as="span">
            ·
            <template v-if="appData">
              #{{ appData.id }}
            </template>
            <TextShimmerBox v-else variant="title1" :width="50" display="inline-block"/>
          </ColorBox>
        </AutoTypography>
        <AutoSection
          v-for="(section, sectionIdx) in sections"
          :key="sectionIdx"
          list-bg-color="secondary-bg"
          :class="e('section', sectionIdx && 'offset-top')"
        >
          <template v-if="section.title" #header>
            <AutoSectionHeader>
              {{ section.title }}
            </AutoSectionHeader>
          </template>
          <AutoList>
            <AutoListItem
              v-for="item in section.items"
              :key="item.name"
              :variant="isSendingRequest ? 'placeholder' : 'regular'"
              :clickable="!isSendingRequest"
              @click="!isSendingRequest && navigateTo({
                name: item.name,
                query: {appId: query.appId}
              })"
            >
              <template #left>
                <AutoListItemLeft>
                  <AutoListItemLeftIcon pad-left>
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
                <AutoListItemBodyLeftLabel>
                  {{ item.title }}
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
        <AutoSection
          :class="e('section', 'offset-top')"
          :list-bg-color="isSendingRequest ? 'secondary-bg' : 'rgb(221 4 4 / 19%)'"
        >
          <AutoList>
            <AutoListItem
              :variant="isSendingRequest ? 'placeholder' : 'destructive'"
              :clickable="!isSendingRequest"
              @click="!isSendingRequest && handleDelete()"
            >
              <template #left>
                <AutoListItemLeft>
                  <AutoListItemLeftIcon pad-left>
                    <AutoListItemLeftIconElement>
                      <IconBinOutline28/>
                    </AutoListItemLeftIconElement>
                  </AutoListItemLeftIcon>
                </AutoListItemLeft>
              </template>
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  {{ t('deleteApp') }}
                </AutoListItemBodyLeftLabel>
              </template>
            </AutoListItem>
          </AutoList>
        </AutoSection>
      </PagePaddings>
    </PageContent>
  </PageBase>
</template>

<style lang="scss">
.app-page {
  &__icon {
    display: block;
    margin: 0 auto;
    border-radius: 20px;
    margin-bottom: 12px;
  }

  &__section {
    &--offset-top {
      margin-top: 16px;
    }
  }

  &__title {
    text-align: center;
    margin: 0 0 16px;
  }

  &__title-shimmer {
    margin: 0 auto 16px;
    display: flex;
    align-items: center;
  }
}
</style>
