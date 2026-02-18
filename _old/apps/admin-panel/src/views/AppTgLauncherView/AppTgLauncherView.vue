<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import {
  copyTextToClipboard,
  hapticFeedbackNotificationOccurred,
  onMainButtonClick,
  setMainButtonParams,
} from '@telegram-apps/sdk-vue';
import { computed, onWatcherCleanup, ref, watch, watchEffect, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { bem } from 'vue-ui';

import { useAppIDFromParams } from '@/navigation/useAppIDFromParams';
import List from '@/ui/adapters/List.js';
import ListItem from '@/ui/adapters/ListItem.js';
import ListItemBodyInput from '@/ui/adapters/ListItemBodyInput.js';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel';
import Page from '@/ui/components/Page.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';

const [, e] = bem('app-tg-launcher-view');
const { t } = useI18n({
  messages: {
    en: {
      fallbackURLTitle: 'Fallback URL',
      fallbackURLFooter: 'URL to use if something goes wrong with Platformer. Ensures the user can still access the application even if Platformer is unavailable.',
      initTimeoutTitle: 'Init timeout',
      initTimeoutFooter: 'Time in milliseconds to load data from Platformer. If the timeout is reached, the launcher uses the <b>Fallback URL</b> to display the application. If the fallback URL is not specified, the load error page will be displayed. Default is <b>5,000</b>.',
      loadTimeoutTitle: 'Load timeout',
      loadTimeoutFooter: 'Time in milliseconds for your application to load. If the specified time runs out, the launcher displays a load error. Default is <b>10,000</b>.',
      copied: 'Copied!',
      copy: 'Copy Launcher URL',
      launcherURLTitle: 'Launcher URL',
      launcherURLFooter: 'Use this link as your mini app link in {\'@\'}BotFather.',
      optional: 'optional',
    },
    ru: {
      fallbackURLTitle: 'Fallback URL',
      fallbackURLFooter: 'Ссылка, которую нужно использовать в случае неработоспособности Платформера. Установливая это значение, вы можете быть уверены, что пользователи смогут зайти в приложение даже если Платформер недоступен.',
      initTimeoutTitle: 'Тайм-аут инициализации',
      initTimeoutFooter: 'Время в миллисекундах для загрузки данных с сервера Платформера. Если тайм-аут был достигнут, лаунчер использует <b>Fallback URL</b> для показа приложения. Если fallback URL не указан, лаунчер отобразит страницу с ошибкой. Значение по умолчанию: <b>5,000</b>.',
      loadTimeoutTitle: 'Тайм-аут загрузки',
      loadTimeoutFooter: 'Время в миллисекундах, которое дается Вашему мини-приложения для загрузки. Если указанное время истекает, лаунчер отобразит ошибку. Значение по умолчанию: <b>10,000</b>.',
      copied: 'Скопировано!',
      copy: 'Скопировать ссылку на лаунчер',
      launcherURLTitle: 'Ссылка на лаунчер',
      launcherURLFooter: 'Используйте эту ссылку в качестве ссылки на мини-приложение в {\'@\'}BotFather.',
      optional: 'опционально',
    },
  },
});
const appID = useAppIDFromParams();
const fallbackURL = ref('');
const initTimeout = ref('');
const loadTimeout = ref('');
const baseURL = `https://tgl.mini-apps.store/?app_id=${appID}`;

const createField = (
  title: string,
  description: string,
  query: string,
  ref: Ref<string>,
  numeric?: boolean,
) => {
  return { title, description, ref, numeric, query };
};

const fields = computed(() => [
  createField(t('fallbackURLTitle'), t('fallbackURLFooter'), 'fallback_url', fallbackURL),
  createField(t('initTimeoutTitle'), t('initTimeoutFooter'), 'init_timeout', initTimeout, true),
  createField(t('loadTimeoutTitle'), t('loadTimeoutFooter'), 'load_timeout', loadTimeout, true),
]);

const isCopyDone = ref(false);
const { mutate: copy, isPending: isCopying } = useMutation({
  mutationFn: copyTextToClipboard,
  onSuccess() {
    isCopyDone.value = true;
  },
  onError() {
    hapticFeedbackNotificationOccurred('error');
  },
});

watchEffect(() => {
  setMainButtonParams({
    isVisible: true,
    isEnabled: !isCopyDone.value,
    isLoaderVisible: isCopying.value,
    text: t(isCopyDone.value ? 'copied' : 'copy'),
  });
  onWatcherCleanup(onMainButtonClick(() => {
    copy(
      fields.value.reduce<string>((acc, field) => {
        return acc + (
          field.ref.value
            ? `&${field.query}=${encodeURIComponent(field.ref.value)}`
            : ''
        );
      }, baseURL),
    );
  }));
});

watch(isCopyDone, (current, prev) => {
  if (!prev && current) {
    hapticFeedbackNotificationOccurred('success');
    const timeoutID = setTimeout(() => {
      isCopyDone.value = false;
    }, 1000);

    onWatcherCleanup(() => {
      clearTimeout(timeoutID);
    });
  }
});
</script>

<template>
  <Page preserve-main-button>
    <PagePaddings>
      <List :title="t('launcherURLTitle')">
        <ListItem>
          <template #bodyLeftLabel>
            <ListItemBodyLeftLabel multiline>
              {{ baseURL }}
              <template
                v-for="field in fields.filter(item => item.ref.value)"
                :key="field.query"
              >
                <br>&nbsp;&nbsp;&{{ field.query }}={{ encodeURIComponent(field.ref.value) }}
              </template>
            </ListItemBodyLeftLabel>
          </template>
        </ListItem>
        <template #footer>
          {{ t('launcherURLFooter') }}
        </template>
      </List>
      <List
        v-for="field in fields"
        :key="field.title"
        :class="e('field')"
        :title="field.title"
      >
        <ListItem>
          <template #bodyInput>
            <ListItemBodyInput
              v-model:value="field.ref.value"
              :placeholder="t('optional')"
              :type="field.numeric ? 'number' : 'text'"
            />
          </template>
        </ListItem>
        <template #footer>
          <span v-html="field.description" />
        </template>
      </List>
    </PagePaddings>
  </Page>
</template>

<style>
.app-tg-launcher-view__field {
  margin-top: 8px;
}
</style>
