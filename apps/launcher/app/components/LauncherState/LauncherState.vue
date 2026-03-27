<script setup lang="ts">
import { openTelegramLink } from '@tma.js/sdk-vue';
import type * as v from 'valibot';

import platformerLogoSrc from '@/assets/platformer-logo.svg?url';

import { Translation } from '#i18n';

export type LauncherStateState = (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { kind: 'config-invalid'; error: v.ValiError<any> }
  | { kind: 'init-data-missing'; error: Error }
  | { kind: 'unknown-error'; error: Error }
  | { kind: 'loading'; step: 'getting-data' | 'waiting-load' }
  | { kind: 'app-not-found' }
  | { kind: 'app-device-inaccessible' }
  | { kind: 'app-timeout' }
  | { kind: 'app-error' }
  | { kind: 'app-http-url'; type: 'error' | 'warning' }
  | { kind: 'api-error'; error: Error }
  | { kind: 'api-timeout'; timeout: number }
);

const props = defineProps<{ state: LauncherStateState }>();

const { t } = useI18n({
  messages: {
    en: {
      'appNotFound.title': 'App not found',
      'appNotFound.message': 'This application was not found',
      'appDeviceInaccessible.title': 'Nothing here',
      'appDeviceInaccessible.message': 'The application is inaccessible on your device',
      'loading.title': 'Loading application',
      'loading.gettingData.message': 'Getting app information',
      'loading.waitingLoad.message': 'Waiting for the app to load',
      defaultErrorTitle: 'Something went wrong',
      defaultErrorMessage: 'Unknown error occurred{error}',
      'initDataMissing.title': 'Init data is missing',
      'initDataMissing.message': 'It is the most likely that the application was launched improperly',
      'configInvalid.title': 'Incorrect configuration',
      'apiTimeout.message': 'Failed to get app information (timed out {time}ms)',
      'appTimeout.message': 'The app took too long to load',
      'appError.message': 'An unknown error occurred while loading the application',
      'appHttpUrl.title': 'HTTP URL detected',
      'appHttpUrl.error.message': 'Due to web restrictions, Platformer doesn\'t support HTTP links in web clients. Try using an HTTPS link or a different client',
      'appHttpUrl.warning.message': 'Due to web restrictions, Platformer doesn\'t support HTTP links, but can redirect you to them.\n\nIn this case Platformer\'s functionality will be unavailable',
      'disclaimer.base': 'Works on {project}',
      'disclaimer.project': 'Platformer',
    },
    ru: {
      'appNotFound.title': 'Приложение не найдено',
      'appNotFound.message': 'Это приложение не было найдено',
      'appDeviceInaccessible.title': 'Тут пусто',
      'appDeviceInaccessible.message': 'Приложение недоступно на Вашем устройстве',
      'loading.title': 'Загрузка приложения',
      'loading.gettingData.message': 'Получение информации о приложении',
      'loading.waitingLoad.message': 'Ожидание загрузки приложения',
      defaultErrorTitle: 'Что-то пошло не так',
      defaultErrorMessage: 'Произошла неизвестная ошибка{error}',
      'initDataMissing.title': 'Данные инициализации отсутствуют',
      'initDataMissing.message': 'Скорее всего приложение было запущено некорректно',
      'configInvalid.title': 'Некорректная настройка',
      'apiTimeout.message': 'Не удалось получить информацию о приложении (время истекло {time}ms)',
      'appTimeout.message': 'Загрузка приложения оказалась слишком долгой',
      'appError.message': 'Произошла неизвестная ошибка при загрузке приложения',
      'appHttpUrl.error.message': 'Из-за веб-ограничений, Платформер не поддерживает HTTP-ссылки в веб-клиентах. Попробуйте указать HTTPS-ссылку, или использовать другой клиент',
      'appHttpUrl.title': 'Обнаружена HTTP-ссылка',
      'appHttpUrl.warning.message': 'Платформер не поддерживает HTTP-ссылки из-за веб-ограничений, но может перенаправить Вас на них.\n\nВ этом случае функционал Платформера не будет доступен',
      'disclaimer.base': 'Работает на {project}',
      'disclaimer.project': 'Платформере',
    },
  },
});

const { b, e } = bem('launcher-state');
const locales = ['ru', 'en'] as const;
const channelLink = 'https://t.me/platformer_hq';

const icon = computed<'loading' | 'warning' | 'error' | undefined>(() => {
  const { state } = props;
  switch (state.kind) {
    case 'loading':
      return 'loading';
    case 'app-http-url':
      return state.type;
    case 'app-not-found':
    case 'app-device-inaccessible':
      return;
    default:
      return 'error';
  }
});
const canRetry = computed(() => [
  'unknown-error',
  'app-not-found',
  'app-device-inaccessible',
  'app-timeout',
  'app-error',
  'app-http-url',
  'api-error',
  'api-timeout',
].includes(props.state.kind));
const texts = computed<
  | ({ kind: 'locale-dependent'; titleKey: string } & ({ messageKey: string } | { message: string }))
  | { kind: 'static'; title: string; message: string }
  | { kind: 'none' }
>(() => {
  const { state } = props;

  if (state.kind === 'loading') {
    return {
      kind: 'locale-dependent',
      titleKey: 'loading.title',
      messageKey: state.step === 'waiting-load'
        ? 'loading.waitingLoad.message'
        : 'loading.gettingData.message',
    };
  }
  if (state.kind === 'config-invalid') {
    return {
      kind: 'locale-dependent',
      titleKey: 'configInvalid.title',
      message: state.error.message,
    };
  }
  if (state.kind === 'api-error') {
    // FIXME:
    return { kind: 'none' };
  }
  let title: string;
  let message: string;
  if (state.kind === 'app-http-url') {
    title = t('appHttpUrl.title');
    message = state.type === 'error'
      ? t('appHttpUrl.error.message')
      : t('appHttpUrl.warning.message');
  } else if (
    state.kind === 'app-device-inaccessible'
    || state.kind === 'app-not-found'
    || state.kind === 'init-data-missing'
    || state.kind === 'api-timeout'
    || state.kind === 'app-timeout'
    || state.kind === 'app-error'
  ) {
    [title, message] = ({
      'app-device-inaccessible': [
        t('appDeviceInaccessible.title'),
        t('appDeviceInaccessible.message'),
      ],
      'app-not-found': [t('appNotFound.title'), t('appNotFound.message')],
      'app-timeout': [t('defaultErrorTitle'), t('appTimeout.message')],
      'app-error': [t('defaultErrorTitle'), t('appError.message')],
      'init-data-missing': [t('initDataMissing.title'), t('initDataMissing.message')],
      'api-timeout': [t('defaultErrorTitle'), t('apiTimeout.message')],
    } as const)[state.kind];
  } else {
    title = t('defaultErrorTitle');
    message = t('defaultErrorMessage', {
      error: state.error.cause instanceof Error
        ? `: ${state.error.cause.message}`
        : '',
    });
  }
  return { kind: 'static', title, message };
});
</script>

<template>
  <div :class="b()">
    <div :class="e('body')">
      <div :class="e('logo')">
        <img :src="platformerLogoSrc" :class="e('image')" :width="80" :height="80">
        <IconXmark28 v-if="icon === 'error'" :class="e('status-icon', 'error')"/>
        <IconExclamationMarkTriangleFill28
          v-else-if="icon === 'warning'"
          :class="e('status-icon', 'warning')"
        />
        <div v-else-if="icon === 'loading'" :class="e('status-icon', 'loading')">
          <LoadingIndicatorIos :class="e('loader', 'ios')" :size="14"/>
          <LoadingIndicatorAndroid :class="e('loader', 'android')" :size="14"/>
        </div>
      </div>
      <div :class="e('content')">
        <template v-if="texts.kind === 'locale-dependent'">
          <template v-for="locale in locales" :key="locale">
            <div :class="e('locale-dependent', locale)" :locale="locale">
              <StatusPageTitle>
                {{ t(texts.titleKey || 'defaultErrorTitle', {}, { locale }) }}
              </StatusPageTitle>
              <StatusPageMessage>
                {{ 'messageKey' in texts ? t(texts.messageKey, {}, { locale }) : texts.message }}
              </StatusPageMessage>
            </div>
          </template>
        </template>
        <template v-else-if="texts.kind === 'static'">
          <StatusPageTitle>
            {{ texts.title }}
          </StatusPageTitle>
          <StatusPageMessage>
            {{ texts.message }}
          </StatusPageMessage>
        </template>
      </div>
    </div>
    <VTypography :class="e('disclaimer')" variant="footnote">
      <Translation keypath="disclaimer.base">
        <template #project>
          <a
            :class="e('disclaimer-link')"
            :href="channelLink"
            @click.prevent="openTelegramLink(channelLink)"
          >
            {{ t('disclaimer.project') }}
          </a>
        </template>
      </Translation>
    </VTypography>
    <LauncherStateBottomBar :show="canRetry" @button-click="$emit('retry')"/>
  </div>
</template>

<style lang="scss">
@use "sass:map" as map;
@use "sass:list" as list;

.launcher-state {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: 1fr auto auto;
  text-align: center;
  background: var(--bg-color);
  padding:
    var(--sum-inset-top)
    var(--sum-inset-right)
    0
    var(--sum-inset-left);

  &__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-inline: 16px;
  }

  &__locale-dependent {
    display: none;
    @each $locale in ("ru", "en") {
      [data-locale="#{$locale}"] & {
        &--#{$locale} {
          display: block;
        }
      }
    }
  }

  &__logo {
    position: relative;
  }

  &__image {
    display: block;
    border-radius: 16px;
    overflow: hidden;
  }

  &__status-icon {
    $statusIconShift: translate3d(-75%, -75%, 0);
    @keyframes status-page-error-icon-appear {
      from {
        opacity: 0;
        transform: $statusIconShift scale(.65);
      }
      50% {
        transform: $statusIconShift scale(1.2);
      }
      to {
        opacity: 1;
        transform: $statusIconShift scale(1);
      }
    }
    position: absolute;
    top: 100%;
    left: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    padding: 4px;
    box-sizing: content-box;
    border-radius: 50%;
    color: white;
    animation: status-page-error-icon-appear 400ms ease forwards;

    &--error {
      background: var(--destructive-text-color);

      path {
        stroke-width: 4;
      }
    }

    &--warning {
      background: orange;
    }

    &--loading {
      background: var(--secondary-bg-color);
    }
  }

  &__loader {
    display: none;
    @each $platform in ("ios", "android") {
      [data-platform="#{$platform}"] & {
        &--#{$platform} {
          display: flex;
        }
      }
    }
  }

  &__content {
    @keyframes status-page-content-appear {
      from {
        opacity: 0;
        max-height: 28px;
      }
      to {
        opacity: 1;
        max-height: 30vh;
      }
    }
    text-align: center;
    text-wrap: balance;
    animation: status-page-content-appear 200ms ease forwards;
  }

  &__disclaimer {
    color: var(--hint-color);
    padding-bottom: 8px;

    &--inset-bottom {
      padding-bottom: calc(var(--sum-inset-bottom) + 8px);
    }
  }

  &__disclaimer-link {
    text-decoration: none;
    color: var(--link-color);
  }
}
</style>
