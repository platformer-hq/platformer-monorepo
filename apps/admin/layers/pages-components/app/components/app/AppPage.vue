<script setup lang="ts">
import { popup } from '@tma.js/sdk-vue';
import {
  IconAdvancedSettings30,
  IconUsers30,
  IconTelegram24,
  IconSurveys30,
  IconPersonLineDottedFill28,
  IconLink30,
  IconEyeFillIOS28,
  IconDataAndStorage30,
  IconBinOutline28,
} from '@tma.js/vue-kit';
import * as fp from 'fp-ts';
import * as v from 'valibot';

import AppIcon from './_components/AppIcon.vue';
import { AppPageDataDocument, DeleteAppDocument } from './operations';

const createIconComponent = <C extends Component>(component: C, size?: number) => ({
  kind: 'component' as const,
  component,
  size,
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
const CacheIcon = createIconComponent(IconDataAndStorage30, 24);
const TransferIcon = createCustomIconComponent(IconPersonLineDottedFill28, 20, '#34C759');
const TelegramIcon = createCustomIconComponent(IconTelegram24, 20, '#007AFF');
const UrlViewerIcon = createCustomIconComponent(IconEyeFillIOS28, 22, '#FF2D55');

const query = v.parse(
  v.looseObject({ appId: v.pipe(v.string(), v.transform(Number)) }),
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
      'utils.urlViewer': 'URL Viewer',
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
      'integrations.tg': 'Telegram',
      'utils.title': 'Утилиты',
      'utils.urlViewer': 'Обозреватель ссылок',
      'utils.cache': 'Кеширование',
      'popup.delete.title': 'Подтвердите удаление приложения',
      'popup.delete.message': 'Вы уверены, что хотите удалить приложение? Это действие необратимо.',
      'popup.delete.cancel': 'Отмена',
      'popup.delete.confirm': 'Удалить',
      deleteApp: 'Удалить приложение',
    },
  },
});
const isDark = useIsDark();
const request = useMakeApiGqlRequest();
const { data: appData, isPending: isLoadingApp } = useQuery({
  key: [AppPageDataDocument, query.appId],
  query: throwify(() => {
    return fp.function.pipe(
      request(AppPageDataDocument, { appID: query.appId }),
      fp.taskEither.map(({ app }) => (
        app
          ? { id: app.id, title: app.title, role: apiAppRoleToLocal(app.currentUserRole) }
          : null
      )),
    );
  }),
});
const { mutate: deleteApp, isLoading: isDeletingApp } = useMutation({
  key: [DeleteAppDocument],
  mutation: throwify((options: { appId: number }) => {
    return request(DeleteAppDocument, { appID: options.appId });
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
      { icon: GeneralIcon, title: t('common.general'), name: PageNames.AppGeneral },
      { icon: ManagersIcon, title: t('common.managers'), name: PageNames.AppManagers },
      { icon: URLsIcon, title: t('common.urls'), name: PageNames.AppUrls },
      { icon: TestGroupsIcon, title: t('common.testGroups'), name: PageNames.AppTestGroups },
      { icon: TransferIcon, title: t('common.transfer'), name: PageNames.AppTransfer },
    ],
  },
  {
    title: t('integrations.title'),
    items: [
      { icon: TelegramIcon, title: t('integrations.tg'), name: PageNames.AppTg },
    ],
  },
  {
    title: t('utils.title'),
    items: [
      { icon: UrlViewerIcon, title: t('utils.urlViewer'), name: PageNames.AppUrlViewer },
      { icon: CacheIcon, title: t('utils.cache'), name: PageNames.AppCache },
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
  preloadRouteComponents({ name: PageNames.Apps });
  sections.value.flatMap(s => s.items).forEach(item => {
    preloadRouteComponents({ name: item.name });
  });
});
</script>

<template>
  <PageRoot colors="secondary-bg">
    <PageContent>
      <PagePaddings>
        <AppIcon :class="e('icon')"/>
        <AutoTypography
          as="h1"
          variant="title2"
          :class="e('title')"
          weight="semibold"
        >
          <template v-if="appData">
            {{ appData.title }}
          </template>
          <TextShimmerBox v-else :width="130" display="inline-block"/>
          <ColorBox text="hint" as="span">
            ·
            <template v-if="appData">
              #{{ appData.id }}
            </template>
            <TextShimmerBox v-else :width="50" display="inline-block"/>
          </ColorBox>
        </AutoTypography>
        <AutoSection
          v-for="(section, sectionIdx) in sections"
          :key="sectionIdx"
          list-bg-color="section-bg"
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
          :list-bg-color="isSendingRequest
            ? 'secondary-bg'
            : isDark
              ? 'rgb(221 4 4 / 19%)'
              : 'rgb(221 4 4 / 10%)'"
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
  </PageRoot>
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
