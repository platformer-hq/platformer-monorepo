<script setup lang="ts">
import { popup } from '@tma.js/sdk-vue';
import * as fp from 'fp-ts';

import { useAppSplashScreenPageQueryMeta } from './composables/useAppSplashScreenPageQueryMeta';
import defaultIconUrl from './default-icon.svg';
import { ResetAppSplashScreenIconDocument } from './operations';

const appId = useQueryAppId();

const { t } = useI18n({
  messages: {
    ru: {
      title: 'Текущая иконка',
      'editButton.title': 'Загрузить новую иконку',
      'resetButton.title': 'Сбросить иконку',
      'resetPopup.message': 'Вы уверены, что хотите сбросить иконку? Тогда лаунчер будет использовать иконку по умолчанию.',
    },
    en: {
      title: 'Current icon',
      'editButton.title': 'Upload new icon',
      'resetButton.title': 'Reset icon',
      'resetPopup.message': 'Are you sure you want to reset the icon? The launcher will use the default one then.',
    },
  },
});
const platform = useTmaPlatform();

//#region Requests.
const { options: queryOptions, setData: setQueryData } = useAppSplashScreenPageQueryMeta();
const { setData: setUploadPageQueryData } = useAppSplashScreenUploadPageQueryMeta();
const apiGqlRequest = useMakeApiGqlRequest();
const { data } = useQuery(() => queryOptions(appId.value));
const { mutate: resetIcon, isLoading: isResettingIcon } = useMutation({
  key: [ResetAppSplashScreenIconDocument],
  mutation(options: { appId: number }) {
    return throwifyAnyEither(
      fp.function.pipe(
        apiGqlRequest(ResetAppSplashScreenIconDocument, { appId: options.appId }),
        fp.taskEither.map(r => ({
          iconUrl: r.updateApp.splashScreenIconUrl,
        })),
      ),
    );
  },
  onSuccess({ iconUrl }) {
    setQueryData(appId.value, data => (
      data ? { ...data, iconUrl: iconUrl || undefined } : data
    ));
    setUploadPageQueryData(appId.value, data => (
      data ? { ...data, iconUrl: iconUrl || undefined } : data
    ));
    hapticNotificationOccurred('success');
  },
  onError() {
    hapticNotificationOccurred('error');
    // FIXME: error popup
  },
});
//#endregion

const iconUrl = computed(() => (
  data.value
    ? data.value.iconUrl || defaultIconUrl
    : undefined
));

const handleReset = async () => {
  const buttonId = await popup.show({
    message: t('resetPopup.message'),
    buttons: [
      { id: 'ok', type: 'ok' },
      { id: 'cancel', type: 'cancel' },
    ],
  });
  if (buttonId === 'ok') {
    resetIcon({ appId: appId.value });
  }
};
const { e } = bem('app-splash-screen-page');

preloadRouteComponents({ name: PageNames.AppSplashScreenUpload });
</script>

<template>
  <PageRoot colors="secondary-bg">
    <PageContent>
      <PagePaddings>
          <AutoTypography
            :class="e('title', platform.mapped)"
            color="subtitle-text"
            variant="subheadline1"
            weight="semibold"
          >
            {{ t('title') }}
          </AutoTypography>
        <AutoRoundedPanel :class="e('preview')">
          <ProgressiveImage
            v-if="iconUrl"
            v-slot="{isError, isLoaded, onError, onLoad, src, srcset}"
            :src="iconUrl"
            :width="80"
            :height="80"
          >
            <ProgressiveImageTransition>
              <ProgressiveImagePlaceholder v-if="isError"/>
            </ProgressiveImageTransition>
            <ProgressiveImageElement
              v-bind="{ src, srcset, onError, show: isLoaded }"
              fit="contain"
              @ready="onLoad"
            />
          </ProgressiveImage>
        </AutoRoundedPanel>

        <AutoSection :class="e('buttons')" list-bg-color="section-bg">
          <AutoList>
            <AutoListItem
              :variant="isResettingIcon ? 'placeholder' : 'accent'"
              clickable
              @click="!isResettingIcon && navigateTo({
                name: PageNames.AppSplashScreenUpload,
                query: { appId }
              })"
            >
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  {{ t('editButton.title') }}
                </AutoListItemBodyLeftLabel>
              </template>
            </AutoListItem>
            <Transition v-bind="createListItemTransition()" :css="false">
              <AutoListItem
                v-if="data?.iconUrl"
                :variant="isResettingIcon ? 'placeholder' : 'destructive'"
                clickable
                @click="!isResettingIcon && handleReset()"
              >
                <template #bodyLeftLabel>
                  <AutoListItemBodyLeftLabel>
                    {{ t('resetButton.title') }}
                  </AutoListItemBodyLeftLabel>
                </template>
              </AutoListItem>
            </Transition>
          </AutoList>
        </AutoSection>
      </PagePaddings>
    </PageContent>
  </PageRoot>
</template>

<style lang="scss">
.app-splash-screen-page {
  &__title {
    margin: 16px 0 8px;

    &--ios {
      padding-left: 16px;
    }

    &--android {
      padding-left: 20px;
    }
  }

  &__preview {
    background-color: var(--bg-color);
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__buttons {
    margin-top: 16px;
  }
}
</style>
