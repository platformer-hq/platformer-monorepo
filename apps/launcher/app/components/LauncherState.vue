<script setup lang="ts">
import { openTelegramLink } from '@tma.js/sdk-vue';
import type * as v from 'valibot';

import platformerLogoSrc from '@/assets/platformer-logo.svg?url';

import { Translation } from '#i18n';

export type LauncherStateState = (
  | { kind: 'loading'; step: 'getting-data' | 'waiting-load' }
  | {
    kind: 'error';
    params: (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | { kind: 'config-invalid'; error: v.ValiError<any> }
      | { kind: 'init-data-missing'; error: Error }
      | { kind: 'unknown'; error: Error }
      | { kind: 'iframe'; timeout?: boolean }
      | { kind: 'init'; timeout: number }
      | { kind: 'http-web' }
      // | { type: 'server'; cause: Error | InstanceType<typeof ApiError> }
    );
  }
  | { kind: 'warning'; params: { kind: 'http-url' } }
  | {
    kind: 'neutral';
    params: (
      | { kind: 'app-not-found' }
      | { kind: 'app-device-inaccessible' }
    );
  }
);

const props = defineProps<{ state: LauncherStateState }>();

const { t } = useI18n({
  messages: {
    en: {
      'neutral.appNotFound.title': 'App not found',
      'neutral.appNotFound.message': 'This application was not found',
      'neutral.appDeviceInaccessible.title': 'Nothing here',
      'neutral.appDeviceInaccessible.message': 'The application is inaccessible on your device',
      'loading.title': 'Loading application',
      'loading.message.gettingData': 'Getting app information',
      'loading.message.waitingLoad': 'Waiting for the app to load',
      'error.defaultTitle': 'Something went wrong',
      'error.defaultMessage': 'Unknown error occurred{error}',
      'error.initDataMissing.title': 'Init data is missing',
      'error.initDataMissing.message': 'It is the most likely that the application was launched improperly',
      'error.configInvalid.title': 'Incorrect configuration',
      'error.init.message': 'Failed timeout get app information (timed out {time}ms)',
      'error.iframe.timeout.message': 'The app took too long to load',
      'error.iframe.unknown.message': 'An unknown error occurred while loading the application',
      'error.httpWeb.title': 'HTTP URL detected',
      'error.httpWeb.message': 'Due to web restrictions, Platformer doesn\'t support HTTP links in web clients. Try using an HTTPS link or a different client',
      'warning.httpUrl.title': 'HTTP URL detected',
      'warning.httpUrl.message': 'Due to web restrictions, Platformer doesn\'t support HTTP links, but can redirect you to them.\n\nIn this case Platformer\'s functionality will be unavailable',
      'disclaimer.base': 'Works on {project}',
      'disclaimer.project': 'Platformer',
    },
    ru: {
      'neutral.appNotFound.title': 'Приложение не найдено',
      'neutral.appNotFound.message': 'Это приложение не было найдено',
      'neutral.appDeviceInaccessible.title': 'Тут пусто',
      'neutral.appDeviceInaccessible.message': 'Приложение недоступно на Вашем устройстве',
      'loading.title': 'Загрузка приложения',
      'loading.message.gettingData': 'Получение информации о приложении',
      'loading.message.waitingLoad': 'Ожидание загрузки приложения',
      'error.defaultTitle': 'Что-то пошло не так',
      'error.defaultMessage': 'Произошла неизвестная ошибка{error}',
      'error.initDataMissing.title': 'Данные инициализации отсутствуют',
      'error.initDataMissing.message': 'Скорее всего приложение было запущено некорректно',
      'error.configInvalid.title': 'Некорректная настройка',
      'error.init.message': 'Не удалось получить информацию о приложении (время истекло {time}ms)',
      'error.iframe.timeout.message': 'Загрузка приложения оказалась слишком долгой',
      'error.iframe.unknown.message': 'Произошла неизвестная ошибка при загрузке приложения',
      'error.httpWeb.title': 'Обнаружена HTTP-ссылка',
      'error.httpWeb.message': 'Из-за веб-ограничений, Платформер не поддерживает HTTP-ссылки в веб-клиентах. Попробуйте указать HTTPS-ссылку, или использовать другой клиент',
      'warning.httpUrl.title': 'Обнаружена HTTP-ссылка',
      'warning.httpUrl.message': 'Платформер не поддерживает HTTP-ссылки из-за веб-ограничений, но может перенаправить Вас на них.\n\nВ этом случае функционал Платформера не будет доступен',
      'disclaimer.base': 'Работает на {project}',
      'disclaimer.project': 'Платформере',
    },
  },
});

const { b, e } = bem('launcher-state');
const locales = ['ru', 'en'] as const;
const channelLink = 'https://t.me/platformer_hq';

const texts = computed<
  | ({ kind: 'locale-dependent'; titleKey: string } & ({ messageKey: string } | { message: string }))
  | { kind: 'static'; title: string; message: string }
  | { kind: 'none' }
>(() => {
  const { state } = props;
  if (state.kind === 'neutral') {
    const { kind } = state.params;
    return {
      kind: 'static',
      title: t({
        'app-not-found': 'neutral.appNotFound.title',
        'app-device-inaccessible': 'neutral.appDeviceInaccessible.title',
      }[kind]),
      message: t({
        'app-not-found': 'neutral.appNotFound.message',
        'app-device-inaccessible': 'neutral.appDeviceInaccessible.message',
      }[kind]),
    };
  }
  if (state.kind === 'loading') {
    return {
      kind: 'locale-dependent',
      titleKey: 'loading.title',
      messageKey: state.step === 'waiting-load'
        ? 'loading.message.waitingLoad'
        : 'loading.message.gettingData',
    };
  }
  if (state.kind === 'warning') {
    return {
      kind: 'static',
      title: t('warning.httpUrl.title'),
      message: t('warning.httpUrl.message'),
    };
  }
  if (state.kind === 'error') {
    const { params } = state;
    if (params.kind === 'config-invalid') {
      return {
        kind: 'locale-dependent',
        titleKey: 'error.configInvalid.title',
        message: params.error.message,
      };
    }
    const { kind } = params;
    const title = t(kind === 'init-data-missing'
      ? 'error.initDataMissing.title'
      : 'error.defaultTitle');

    let message: string;
    if (kind === 'init-data-missing') {
      message = t('error.initDataMissing.message');
    } else if (kind === 'init') {
      message = t('error.init.message', { time: params.timeout });
    } else if (kind === 'iframe') {
      message = t(params.timeout ? 'error.iframe.timeout.message' : 'error.iframe.unknown.message');
    } else if (kind === 'unknown') {
      message = t('defaultMessage', {
        error: params.error.cause instanceof Error
          ? `: ${params.error.cause.message}`
          : '',
      });
    } else {
      // FIXME: Server error
      message = '';
    }
    return { kind: 'static', title, message };
  }
  return { kind: 'none' };
});
</script>

<template>
  <div :class="b()">
    <div :class="e('body')">
      <div :class="e('logo')">
        <img :src="platformerLogoSrc" :class="e('image')" :width="80" :height="80">
        <IconXmark28 v-if="state.kind === 'error'" :class="e('status-icon', 'error')"/>
        <IconExclamationMarkTriangleFill28
          v-else-if="state.kind === 'warning'"
          :class="e('status-icon', 'warning')"
        />
        <div v-else-if="state.kind === 'loading'" :class="e('status-icon', 'loading')">
          <LoadingIndicatorIos :class="e('loader', 'ios')" :size="14"/>
          <LoadingIndicatorAndroid :class="e('loader', 'android')" :size="14"/>
        </div>
      </div>
      <div :class="e('content')">
        <template v-if="texts.kind === 'locale-dependent'">
          <template v-for="locale in locales" :key="locale">
            <div :class="e('locale-dependent', locale)" :locale="locale">
              <StatusPageTitle>
                {{ t(texts.titleKey || 'error.defaultTitle', {}, { locale }) }}
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
  </div>
</template>

<style lang="scss">
@use "sass:map" as map;
@use "sass:list" as list;

.launcher-state {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: 1fr auto;
  text-align: center;
  background: var(--bg-color);
  padding:
    var(--sum-inset-top)
    var(--sum-inset-right)
    calc(var(--sum-inset-bottom) + 8px)
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
  }

  &__disclaimer-link {
    text-decoration: none;
    color: var(--link-color);
  }
}
</style>
