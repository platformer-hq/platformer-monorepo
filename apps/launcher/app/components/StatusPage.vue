<script setup lang="ts">
import platformerLogoSrc from '@/assets/platformer-logo.svg?url';

export type StatusPageState = (
  | { kind: 'loading'; step: 'getting-data' | 'waiting-load' }
  | { kind: 'error' }
  | { kind: 'warning' }
);

defineProps<{
  state: StatusPageState;
}>();

const { t } = useI18n({
  messages: {
    en: {
      'loading.title': 'Loading application',
      'loading.subtitle.gettingData': 'Getting app information',
      'loading.subtitle.waitingLoad': 'Waiting for the app to load',
    },
    ru: {
      'loading.title': 'Загрузка приложения',
      'loading.subtitle.gettingData': 'Получение информации о приложении',
      'loading.subtitle.waitingLoad': 'Ожидание загрузки приложения',
    },
  },
});

const { b, e } = bem('status-page');
const locales = ['ru', 'en'] as const;
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
        <template v-if="state.kind === 'loading'">
          <template v-for="locale in locales" :key="locale">
            <VTypography :class="e('title', `loading-${locale}`)" as="h1" variant="heading">
              {{ t('loading.title', {}, { locale }) }}
            </VTypography>
            <VTypography :class="e('subtitle', `loading-${locale}`)" as="h2" variant="body">
              {{ t(state.step === 'waiting-load'
                ? 'loading.subtitle.waitingLoad'
                : 'loading.subtitle.gettingData', {}, { locale }) }}
            </VTypography>
          </template>
        </template>
      </div>
    </div>
    <ProjectDisclaimer :class="e('disclaimer')"/>
  </div>
</template>

<style lang="scss">
@use "sass:map" as map;
@use "sass:list" as list;

.status-page {
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

  &__logo {
    position: relative;
  }

  &__image {
    display: block;
    border-radius: 16px;
    overflow: hidden;
  }

  &__status-icon {
    $statusIconShift: translate(-75%, -75%);
    @keyframes status-page-error-icon-appear {
      from {
        opacity: 0;
        transform: $statusIconShift translateZ(0) scale(.65);
      }
      50% {
        transform: $statusIconShift translateZ(0) scale(1.2);
      }
      to {
        opacity: 1;
        transform: $statusIconShift translateZ(0) scale(1);
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

  &__title {
    margin: 16px 0 4px;
  }

  &__subtitle {
    color: var(--subtitle-text-color);
  }

  &__title, &__subtitle {
    display: none;
    @each $locale in ("ru", "en") {
      [data-locale="#{$locale}"] & {
        &--loading-#{$locale} {
          display: block;
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
}
</style>
