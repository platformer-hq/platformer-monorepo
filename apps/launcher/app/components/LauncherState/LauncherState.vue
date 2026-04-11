<script setup lang="ts">
import { bem, createReversibleTransition } from '@tma.js/vue-kit';
import type * as v from 'valibot';

import platformerLogoSrc from '@/assets/platformer-logo.svg?url';

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
  | { kind: 'app-http-url'; type: 'error' | 'warning'; url: string }
  | { kind: 'api-error'; error: Error }
  | { kind: 'api-timeout'; timeout: number }
  | { kind: 'initial' }
);

const props = defineProps<{ state: LauncherStateState }>();
defineEmits<{ retry: [] }>();

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
      'configInvalid.title': 'Incorrect launcher configuration',
      'apiTimeout.message': 'Failed to get app information (timed out {time}ms)',
      'apiError.unknown.message': 'Request error: {error}',
      'apiError.known.message': 'Server returned error: {message}',
      'appTimeout.message': 'The app took too long to load',
      'appError.message': 'An unknown error occurred while loading the application',
      'appHttpUrl.title': 'HTTP URL detected',
      'appHttpUrl.error.message': 'Due to web restrictions, Platformer doesn\'t support HTTP links in web clients. Try using an HTTPS link or a different client',
      'appHttpUrl.warning.message': 'Due to web restrictions, Platformer doesn\'t support HTTP links, but can redirect you to them.\n\nIn this case Platformer\'s functionality will be unavailable',
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
      'configInvalid.title': 'Некорректная настройка лаунчера',
      'apiTimeout.message': 'Не удалось получить информацию о приложении (время истекло {time}ms)',
      'apiError.unknown.message': 'Ошибка отправки запроса: {error}',
      'apiError.known.message': 'Сервер вернул ошибку: {message}',
      'appTimeout.message': 'Загрузка приложения оказалась слишком долгой',
      'appError.message': 'Произошла неизвестная ошибка при загрузке приложения',
      'appHttpUrl.error.message': 'Из-за веб-ограничений, Платформер не поддерживает HTTP-ссылки в веб-клиентах. Попробуйте указать HTTPS-ссылку, или использовать другой клиент',
      'appHttpUrl.title': 'Обнаружена HTTP-ссылка',
      'appHttpUrl.warning.message': 'Платформер не поддерживает HTTP-ссылки из-за веб-ограничений, но может перенаправить Вас на них.\n\nВ этом случае функционал Платформера не будет доступен',
    },
  },
});

const { b, e } = bem('launcher-state');
const contentTransition = createReversibleTransition({
  animatedProperties: {
    maxHeight: ['0px', '260px'],
    opacity: [0, 1],
    transform: ['scale(0.95)', 'scale(1.05)', 'scale(1)'],
  },
  animationOptions: { duration: 300, easing: 'ease-out' },
});

const redirecting = ref(false);

const icon = computed<'loading' | 'warning' | 'error' | undefined>(() => {
  const { state } = props;
  switch (state.kind) {
    case 'loading':
      return 'loading';
    case 'app-http-url':
      return state.type;
    case 'app-not-found':
    case 'app-device-inaccessible':
    case 'initial':
      return;
    default:
      return 'error';
  }
});
const canRetry = computed(() => {
  const { state } = props;
  return [
    'unknown-error',
    'app-not-found',
    'app-device-inaccessible',
    'app-timeout',
    'app-error',
    'api-error',
    'api-timeout',
  ].includes(state.kind)
  || (state.kind === 'app-http-url' && state.type === 'error');
});
const canRedirect = computed(() => {
  return props.state.kind === 'app-http-url' && props.state.type === 'warning';
});
const texts = computed<
  | { kind: 'static'; title: string; message: string }
  | { kind: 'server-error'; title: string; message: string; code?: string }
  | { kind: 'none' }
>(() => {
  const { state } = props;
  let title: string;
  let message: string;

  switch (state.kind) {
    case 'initial':
      return { kind: 'none' };
    case 'api-error':
      return {
        kind: 'server-error',
        title: t('defaultErrorTitle'),
        message: ApiError.is(state.error)
          ? t('apiError.known.message', { message: state.error.data.message })
          : t('apiError.unknown.message', { error: state.error.message }),
        code: ApiError.is(state.error) ? state.error.data.code : undefined,
      };
    case 'loading':
      title = t('loading.title');
      message = t(state.step === 'waiting-load'
        ? 'loading.waitingLoad.message'
        : 'loading.gettingData.message');
      break;
    case 'config-invalid':
      title = t('configInvalid.title');
      message = state.error.message;
      break;
    case 'app-http-url':
      title = t('appHttpUrl.title');
      message = state.type === 'error'
        ? t('appHttpUrl.error.message')
        : t('appHttpUrl.warning.message');
      break;
    case 'app-device-inaccessible':
    case 'app-not-found':
    case 'init-data-missing':
    case 'api-timeout':
    case 'app-timeout':
    case 'app-error':
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
      break;
    default:
      title = t('defaultErrorTitle');
      message = t('defaultErrorMessage', {
        error: state.error.cause instanceof Error
          ? `: ${state.error.cause.message}`
          : '',
      });
  }
  return { kind: 'static', title, message };
});
const contentKey = computed(() => {
  const { state } = props;
  const { kind } = state;
  if (kind === 'app-http-url') {
    return `${kind}-${state.type}`;
  }
  return kind;
});

const handleRedirect = () => {
  if (props.state.kind === 'app-http-url') {
    redirecting.value = true;
    window.location.href = props.state.url;
  }
};
</script>

<template>
  <div :class="b()">
    <div :class="e('body')">
      <div :class="e('logo')">
        <img :src="platformerLogoSrc" :class="e('image')" :width="80" :height="80">
        <ClientOnly>
          <LauncherStateStatusIcon :status="icon"/>
        </ClientOnly>
      </div>
      <Transition v-bind="contentTransition" :css="false" mode="out-in" appear>
        <div :key="contentKey" :class="e('content')">
          <template v-if="texts.kind !== 'none'">
            <LauncherStateTitle>
              {{ texts.title }}
            </LauncherStateTitle>
            <LauncherStateMessage>
              {{ texts.message }}<template v-if="texts.kind === 'server-error' && texts.code">
                <VTypography as="span" weight="semibold">
                  ({{ texts.code }})
                </VTypography>
              </template>
            </LauncherStateMessage>
          </template>
        </div>
      </Transition>
    </div>
    <ClientOnly>
      <LauncherStateBottomBar
        :action="redirecting
          ? 'redirecting'
          : canRetry
            ? 'retry'
            : canRedirect
              ? 'redirect'
              : undefined"
        @redirect="handleRedirect"
        @retry="$emit('retry')"
      />
    </ClientOnly>
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
    var(--tg-viewport-sum-inset-top)
    var(--tg-viewport-sum-inset-right)
    0
    var(--tg-viewport-sum-inset-left);

  &__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-inline: 16px;
  }

  &__logo {
    position: relative;
  }

  &__image {
    display: block;
    border-radius: 16px;
    overflow: hidden;
  }

  &__content {
    text-align: center;
    text-wrap: balance;
  }
}
</style>
