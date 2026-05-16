<script setup lang="ts">
import { copyTextToClipboard } from '@tma.js/sdk-vue';

const { t } = useI18n({
  messages: {
    en: {
      'queryLp.title': 'Pass launch parameters to query',
      'queryLp.footer': 'Enabling this option, launch parameters will be passed to the URL query parameters instead of its hash part. In turn, it allows you to use Server-Side Rendering (SSR).',
      'fallbackUrl.title': 'Fallback URL',
      'fallbackUrl.footer': 'URL to use if something goes wrong with Platformer. Ensures the user can still access the application even if Platformer is unavailable.',
      'initTimeout.title': 'Init timeout',
      'initTimeout.footer': 'Time in milliseconds to load data from Platformer. If the timeout is reached, the launcher uses the Fallback URL to display the application. If the fallback URL is not specified, the load error page will be displayed. Default is 5,000.',
      'loadTimeout.title': 'Load timeout',
      'loadTimeout.footer': 'Time in milliseconds for your application to load. If the specified time runs out, the launcher displays a load error. Default is 10,000.',
      'button.copied': 'Copied!',
      'button.copy': 'Copy Launcher URL',
      'launcherUrl.title': 'Launcher URL',
      'launcherUrl.footer': 'Use this link as your mini app link in {\'@\'}BotFather.',
      optional: 'optional',
    },
    ru: {
      'queryLp.title': 'Параметры запуска в query',
      'queryLp.footer': 'Включение этой опции приведёт к передаче параметров запуска в query-параметры URL-адреса, а не в его хэш-часть. В свою очередь, это позволит использовать Server-Side Rendering (SSR).',
      'fallbackUrl.title': 'Fallback URL',
      'fallbackUrl.footer': 'Ссылка, которую нужно использовать в случае неработоспособности Платформера. Устанавливая это значение, Вы можете быть уверены, что пользователи смогут зайти в приложение, даже если Платформер недоступен.',
      'initTimeout.title': 'Тайм-аут инициализации',
      'initTimeout.footer': 'Время в миллисекундах для загрузки данных с сервера Платформера. Если тайм-аут был достигнут, лаунчер использует Fallback URL для показа приложения. Если fallback URL не указан, лаунчер отобразит страницу с ошибкой. Значение по умолчанию: 5,000.',
      'loadTimeout.title': 'Тайм-аут загрузки',
      'loadTimeout.footer': 'Время в миллисекундах, которое дается Вашему мини-приложения для загрузки. Если указанное время истекает, лаунчер отобразит ошибку. Значение по умолчанию: 10,000.',
      'button.copied': 'Скопировано!',
      'button.copy': 'Скопировать ссылку на лаунчер',
      'launcherUrl.title': 'Ссылка на лаунчер',
      'launcherUrl.footer': 'Используйте эту ссылку в качестве ссылки на мини-приложение в {\'@\'}BotFather.',
      optional: 'опционально',
    },
  },
});

const displayCopied = ref(false);
const { mutate: copy } = useMutation({
  key: ['copy-launcher-url-to-clipboard'],
  mutation: copyTextToClipboard,
  onSuccess() {
    hapticNotificationOccurred('success');
    displayCopied.value = true;
    setTimeout(() => {
      displayCopied.value = false;
    }, 1000);
  },
  onError() {
    hapticNotificationOccurred('error');
  },
});

const appId = useQueryAppId();
const isPageEntered = useIsCurrentPageEntered();
const platform = useTmaPlatform();
const queryLp = ref(false);
const fallbackUrl = ref('');
const initTimeout = ref('');
const loadTimeout = ref('');
const baseUrl = computed(() => `https://tgl.mini-apps.store/?app_id=${appId.value}`);
const fields = computed(() => [{
  title: t('queryLp.title'),
  footer: t('queryLp.footer'),
  param: 'query_lp',
  ref: queryLp,
}, {
  title: t('fallbackUrl.title'),
  footer: t('fallbackUrl.footer'),
  param: 'fallback_url',
  ref: fallbackUrl,
}, {
  title: t('initTimeout.title'),
  footer: t('initTimeout.footer'),
  param: 'init_timeout',
  ref: initTimeout,
  type: 'number',
}, {
  title: t('loadTimeout.title'),
  footer: t('loadTimeout.footer'),
  param: 'load_timeout',
  ref: loadTimeout,
  type: 'number',
}]);

const handleCopy = () => {
  copy(
    fields.value.reduce((acc, field) => {
      const { value } = field.ref;
      return acc + (
        value
          ? `&${field.param}=${value === true ? '1' : encodeURIComponent(value)}`
          : ''
      );
    }, baseUrl.value),
  );
};
</script>

<template>
  <PageRoot colors="secondary-bg">
    <PageContent>
      <PagePaddings>
        <AutoSection list-bg-color="section-bg">
          <template #header>
            <AutoSectionHeader>
              {{ t('launcherUrl.title') }}
            </AutoSectionHeader>
          </template>
          <AutoListItem>
            <template #bodyLeftLabel>
              <AutoListItemBodyLeftLabel>
                {{ baseUrl }}
                <template
                  v-for="field in fields.filter(item => item.ref.value)"
                  :key="field.param"
                >
                  <br>&nbsp;&nbsp;&{{ field.param }}={{
                    field.ref.value === true
                      ? '1'
                      : encodeURIComponent(field.ref.value)
                  }}
                </template>
              </AutoListItemBodyLeftLabel>
            </template>
          </AutoListItem>
          <template #footer>
            <AutoSectionFooter>
              {{ t('launcherUrl.footer') }}
            </AutoSectionFooter>
          </template>
        </AutoSection>
        <template v-for="field in fields" :key="field.param">
          <AutoSection
            v-if="typeof field.ref.value === 'string'"
            list-bg-color="section-bg"
            :style="{marginTop: '16px'}"
          >
            <template #header>
              <AutoSectionHeader>
                {{ field.title }}
              </AutoSectionHeader>
            </template>
            <AutoList>
              <AutoListItem>
                <template #bodyLeftInput>
                  <AutoListItemBodyLeftInput>
                    <AutoListItemBodyLeftInputElement
                      v-model="field.ref.value"
                      :placeholder="t('optional')"
                      :type="field.type"
                    />
                  </AutoListItemBodyLeftInput>
                </template>
              </AutoListItem>
            </AutoList>
            <template #footer>
              <AutoSectionFooter>
                {{ field.footer }}
              </AutoSectionFooter>
            </template>
          </AutoSection>

          <AutoSection v-else list-bg-color="section-bg" :style="{marginTop: '16px'}">
            <AutoList>
              <AutoListItem
                :clickable="platform.isMappedAndroid"
                @click="platform.isMappedAndroid && (field.ref.value = !field.ref.value)"
              >
                <template #bodyLeftLabel>
                  <AutoListItemBodyLeftLabel>
                    {{ field.title }}
                  </AutoListItemBodyLeftLabel>
                </template>
                <template #bodyRight>
                  <AutoListItemBodyRight>
                    <AutoSwitch v-model:checked="field.ref.value"/>
                  </AutoListItemBodyRight>
                </template>
              </AutoListItem>
            </AutoList>
            <template #footer>
              <AutoSectionFooter>
                {{ field.footer }}
              </AutoSectionFooter>
            </template>
          </AutoSection>
        </template>
      </PagePaddings>
    </PageContent>
    <template #bottomBar>
      <BottomBarTransition>
        <BottomBar v-if="isPageEntered">
          <BottomBarInner>
            <AutoButton
              palette="filled"
              full-width
              :active="!displayCopied"
              :disabled="displayCopied"
              @click="handleCopy"
            >
              <AutoTypography variant="body" weight="semibold">
                {{ t(displayCopied ? 'button.copied' : 'button.copy') }}
              </AutoTypography>
            </AutoButton>
          </BottomBarInner>
        </BottomBar>
      </BottomBarTransition>
    </template>
  </PageRoot>
</template>
