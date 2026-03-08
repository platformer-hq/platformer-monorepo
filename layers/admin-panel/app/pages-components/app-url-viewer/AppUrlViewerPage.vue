<script setup lang="ts">
import { useQuery } from '@pinia/colada';
import * as fp from 'fp-ts';

import type { LocalAppSimpleExplanationKind } from '~/domains/api/utils/dto';
import { useNavigateToUserSelection } from '~/navigation/composables/useNavigateToUserSelection';

import { AppUrlViewerPageDataDocument } from './operations';

const { e } = bem('app-url-viewer-page');

const { t } = useI18n({
  messages: {
    en: {
      'title.notSelected': 'URL Viewer',
      'title.selected': 'Selected user',
      footer: 'The URL viewer lets you select a user and displays which URLs will be chosen for them on each platform. It also provides an explanation for why a specific URL was selected',
      'button.select': 'Select user',
      'button.selectAnother': 'Select another user',
      noUrl: 'No URL to display',
      'exp.accessNotAllowed': 'User is not a manager and the application is private',
      'exp.appIsPublic': 'Application is public and accessible to everybody by this URL. A public URL is used',
      'exp.userIsManager': 'Application is private, but the user is its manager. A public URL is used',
      'exp.testGroup': 'The user belongs to the active test group {name}. The test group URL is used',
    },
    ru: {
      'title.notSelected': 'Обозреватель ссылок',
      'title.selected': 'Выбранный пользователь',
      footer: 'Обозреватель ссылок позволяет Вам выбрать пользователя и узнать, какие ссылки будут подобраны под него на каждой платформе. Он также предоставляет пояснение о том, почему именно эта ссылка была выбрана',
      'button.select': 'Выбрать пользователя',
      'button.selectAnother': 'Выбрать другого пользователя',
      noUrl: 'Нет ссылки для отображения',
      'exp.accessNotAllowed': 'Приложение приватно и пользователь не является его менеджером',
      'exp.appIsPublic': 'Приложение публично и доступному всем по указанной ссылке. Использована общедоступная ссылка',
      'exp.userIsManager': 'Приложение приватно, но пользователь является его менеджером. Использована общедоступная ссылка',
      'exp.testGroup': 'Пользователь является участником активной тестовой группы {name}. Используется ссылка этой тестовой группы',
    },
  },
});
const appId = useQueryAppId();
const userSelectionStore = useUserSelectionStore();
const navigateToUserSelection = useNavigateToUserSelection();
const request = useMakeGqlApiRequest();

const lastSelectedUser = ref<UserSelectionStoreSelectedUser | undefined>(
  userSelectionStore.selectedUsers?.[0],
);

const { data } = useQuery({
  enabled: () => lastSelectedUser.value !== undefined,
  key: () => [{
    document: AppUrlViewerPageDataDocument,
    appId: appId.value,
    userId: lastSelectedUser.value?.id,
  }],
  query: throwify(() => {
    return fp.function.pipe(
      request(AppUrlViewerPageDataDocument, {
        appId: appId.value,
        userId: lastSelectedUser.value?.id || 0,
      }),
      fp.taskEither.map(response => {
        return response
          .userAppURLExplanations
          .reduce<{
          url?: string;
          platform: string;
          explanation:
            | { kind: LocalAppSimpleExplanationKind }
            | { kind: 'test-group'; testGroupId: number; testGroupTitle?: string };
        }[]>((acc, exp) => {
            const shared = {
              url: exp.url || undefined,
              platform: exp.platform.completeTitle,
            };
            if ('kind' in exp.explanation) {
              const explanationKind = apiAppSimpleExpKindToLocal(exp.explanation.kind);
              if (explanationKind) {
                acc.push({ ...shared, explanation: { kind: explanationKind } });
              }
            } else if ('id' in exp.explanation) {
              acc.push({
                ...shared,
                explanation: {
                  kind: 'test-group',
                  testGroupId: exp.explanation.id,
                  testGroupTitle: exp.explanation.title || undefined,
                },
              });
            }
            return acc;
          }, [])
          .sort((a, b) => a.platform.localeCompare(b.platform));
      }),
    );
  }),
  staleTime: 0,
});

const explanations = computed(() => {
  const translations = {
    'access-not-allowed': t('exp.accessNotAllowed'),
    'app-is-public': t('exp.appIsPublic'),
    'user-is-manager': t('exp.userIsManager'),
  } as const;

  return data
    .value
    ?.map(({ url, platform, explanation }) => ({
      url,
      platform,
      text: explanation.kind === 'test-group'
        ? t('exp.testGroup', {
          name: explanation.testGroupTitle
            ? `"${explanation.testGroupTitle}" #${explanation.testGroupId}`
            : `#${explanation.testGroupId}`,
        })
        : translations[explanation.kind],
    }));
});

const expTransition = createReversibleTransition({
  animatedProperties: {
    transform: ['scale(0.95)', 'scale(1)'],
    opacity: [0, 1],
  },
  animationOptions: {
    duration: 300,
    easing: 'ease-out',
  },
});
const handleSelectUser = () => {
  navigateToUserSelection({
    limit: 1,
    autoConfirmOnLimit: true,
  });
};

watch(() => userSelectionStore.selectedUsers, users => {
  if (users?.length) {
    lastSelectedUser.value = users[0];
  }
});

onMounted(() => {
  preloadRouteComponents({ name: PAGE_NAME_MAIN });
  preloadRouteComponents({ name: PAGE_NAME_USER_SELECTION });
});
</script>

<template>
  <PageBase colors="secondary-bg">
    <PageContent>
      <PagePaddings>
        <template v-if="lastSelectedUser">
          <AutoSection list-bg-color="section-bg">
            <template #header>
              <AutoSectionHeader>
                {{ t('title.selected') }}
              </AutoSectionHeader>
            </template>
            <AutoList>
              <AutoListItem>
                <template #bodyLeftLabel>
                  <AutoListItemBodyLeftLabel>
                    {{ lastSelectedUser.name }}
                    <span :class="e('user-id')">#{{ lastSelectedUser.id }}</span>
                  </AutoListItemBodyLeftLabel>
                </template>
              </AutoListItem>
            </AutoList>
          </AutoSection>
          <AutoSection list-bg-color="section-bg" :class="e('section')">
            <AutoList>
              <AutoListItem variant="accent" clickable @click="handleSelectUser">
                <template #bodyLeftLabel>
                  <AutoListItemBodyLeftLabel>
                    {{ t('button.selectAnother') }}
                  </AutoListItemBodyLeftLabel>
                </template>
              </AutoListItem>
            </AutoList>
          </AutoSection>

          <template v-if="explanations">
            <TransitionGroup :css="false" appear v-bind="expTransition">
              <AutoSection
                v-for="explanation in explanations"
                :key="explanation.platform"
                list-bg-color="section-bg"
                :class="e('section')"
              >
                <AutoList>
                  <AutoListItem>
                    <template #bodyLeftLabel>
                      <AutoListItemBodyLeftLabel>
                        {{ explanation.platform }}
                      </AutoListItemBodyLeftLabel>
                    </template>
                  </AutoListItem>
                  <AutoListItem>
                    <template #bodyLeftLabel>
                      <AutoListItemBodyLeftLabel
                        :class="e('url', !explanation.url && 'missing')"
                      >
                        {{ explanation.url || t('noUrl') }}
                      </AutoListItemBodyLeftLabel>
                    </template>
                  </AutoListItem>
                  <AutoListItem>
                    <template #bodyLeftLabel>
                      <AutoListItemBodyLeftLabel :class="e('explanation')">
                        {{ explanation.text }}
                      </AutoListItemBodyLeftLabel>
                    </template>
                  </AutoListItem>
                </AutoList>
              </AutoSection>
            </TransitionGroup>
          </template>
          <AutoLoadingIndicator v-else :class="e('loader')" :size="24"/>
        </template>

        <AutoSection v-else list-bg-color="section-bg">
          <template #header>
            <AutoSectionHeader>
              {{ t('title.notSelected') }}
            </AutoSectionHeader>
          </template>
          <AutoList>
            <AutoListItem variant="accent" clickable @click="handleSelectUser">
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  {{ t('button.select') }}
                </AutoListItemBodyLeftLabel>
              </template>
            </AutoListItem>
          </AutoList>
          <template #footer>
            <AutoSectionFooter>
              {{ t('footer') }}
            </AutoSectionFooter>
          </template>
        </AutoSection>
      </PagePaddings>
    </PageContent>
  </PageBase>
</template>

<style lang="scss">
.app-url-viewer-page {
  &__user-id {
    color: var(--subtitle-text-color);
  }

  &__loader {
    margin: 16px auto 0
  }

  &__section {
    margin-top: 16px;
  }

  &__explanation {
    color: var(--subtitle-text-color);
  }

  &__url {
    &--missing {
      color: var(--subtitle-text-color);
    }
  }
}
</style>
