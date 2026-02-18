<script setup lang="ts">
import { onMainButtonClick, setMainButtonParams } from '@telegram-apps/sdk-vue';
import { computed, onWatcherCleanup, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { bem } from 'vue-ui';

import { isAnyHttpUrl } from '@/navigation/isAnyHttpUrl';
import List from '@/ui/adapters/List';
import ListItem from '@/ui/adapters/ListItem';
import ListItemBodyInput from '@/ui/adapters/ListItemBodyInput';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel';
import ListItemLeftLabel from '@/ui/adapters/ListItemLeftLabel';
import Text from '@/ui/adapters/Text.vue';

import HowItWorks from './HowItWorks.vue';
import HttpWarning from './HttpWarning.vue';
import SingleUrlSwitch from './SingleUrlSwitch.vue';

const { urls: propsUrls, platforms, loading } = defineProps<{
  readonly: boolean;
  loading: boolean;
  urls: {
    url: string;
    platform: {
      id: number;
    };
  }[];
  platforms: {
    completeTitle: string;
    title: string;
    id: number;
  }[];
}>();
const emit = defineEmits<{
  update: [{ urls: { [PlatformId: number]: string } }];
}>();
const [, e] = bem('app-urls-view');

const { t } = useI18n({
  messages: {
    en: {
      urlInvalid: 'URL is invalid',
      urlInvalidFor: 'URL for {platform} is invalid',
      apply: 'Apply changes',
      singleUrlFooter: 'This URL will be applied to all Telegram clients.',
      urlsFooter: 'List of URL settings applicable to the Telegram environment.',
      noURL: 'No URL specified',
      required: 'required',
      optional: 'optional',
    },
    ru: {
      urlInvalid: 'Ссылка невалидна',
      urlInvalidFor: 'Ссылка для {platform} невалидна',
      apply: 'Применить изменения',
      singleUrlFooter: 'Эта ссылка будет применена ко всем клиентам Telegram.',
      urlsFooter: 'Список ссылок, применимых к окружению Telegram.',
      noURL: 'Ссылка не указана',
      required: 'обязательно',
      optional: 'опционально',
    },
  },
});

const initialUrls = computed(() => {
  return platforms.reduce<Record<number, string>>(
    (acc, { id: platformID }) => {
      const record = propsUrls.find(item => {
        return item.platform.id === platformID;
      });

      acc[platformID] = record ? record.url : '';
      return acc;
    }, {},
  );
});
const initialSingleUrl = computed(() => {
  let result = '';
  for (const value of Object.values(initialUrls.value)) {
    if (!result) {
      result = value;
      continue;
    }
    if (result !== value) {
      return '';
    }
    result = value;
  }
  return result;
});

const useSingleUrl = ref(!!initialSingleUrl.value);
const singleUrl = ref(initialSingleUrl.value);
const urls = ref(initialUrls);

const invalidPlatform = computed(() => {
  if (useSingleUrl.value) {
    return singleUrl.value && !isAnyHttpUrl(singleUrl.value)
      ? 'single-url' as const
      : undefined;
  }
  return platforms.find(({ id }) => {
    const url = urls.value[id];
    return url && !isAnyHttpUrl(url);
  });
});
const isDataChanged = computed(() => {
  return platforms.some(({ id }) => {
    const comparedWith = useSingleUrl.value ? singleUrl.value : urls.value[id].trim();
    return initialUrls.value[id].trim() !== comparedWith;
  });
});
const hasHttpUrl = computed(() => {
  return (
    useSingleUrl.value
      ? [singleUrl.value]
      : Object.values(urls.value)
  ).some(v => v.trim().startsWith('http:'));
});

watchEffect(() => {
  if (!isDataChanged.value) {
    setMainButtonParams({ isVisible: false });
    return;
  }
  if (invalidPlatform.value) {
    setMainButtonParams({
      isVisible: true,
      isEnabled: false,
      text: invalidPlatform.value === 'single-url'
        ? t('urlInvalid')
        : t('urlInvalidFor', { platform: invalidPlatform.value.completeTitle }),
      isLoaderVisible: false,
    });
    return;
  }
  setMainButtonParams({
    isVisible: true,
    isEnabled: !loading,
    text: t('apply'),
    isLoaderVisible: loading,
  });
  onWatcherCleanup(onMainButtonClick(() => {
    emit('update', {
      urls: useSingleUrl.value
        ? platforms.reduce<Record<number, string>>((acc, platform) => {
          acc[platform.id] = singleUrl.value;
          return acc;
        }, {})
        : urls.value,
    });
  }));
});

const onElementEnter = (el: Element, done: () => void) => {
  return el
    .animate({
      opacity: [0, 0, 1],
      height: ['0px', `${el.clientHeight}px`],
      marginTop: ['-8px', '8px'],
    }, { duration: 300, easing: 'ease-out' })
    .finished
    .then(done);
};
const onElementLeave = (el: Element, done: () => void) => {
  return el
    .animate({
      opacity: [1, 0, 0],
      height: [`${el.clientHeight}px`, '0px'],
      marginTop: ['8px', '0px'],
    }, { duration: 300, easing: 'ease-out' })
    .finished
    .then(done);
};
</script>

<template>
  <SingleUrlSwitch
    v-if="!readonly"
    v-model:checked="useSingleUrl"
  />

  <TransitionGroup
    :css="false"
    @enter="onElementEnter"
    @leave="onElementLeave"
  >
    <List
      v-if="useSingleUrl"
      key="single-url"
      :class="!readonly && e('list')"
    >
      <ListItem>
        <template #bodyInput>
          <ListItemBodyInput
            v-model:value="singleUrl"
            :disabled="loading"
            :placeholder="t('optional')"
          />
        </template>
      </ListItem>
      <template #footer>
        {{ t('singleUrlFooter') }}
      </template>
    </List>
    <List
      v-else
      key="platform-specific"
      :class="!readonly && e('list')"
    >
      <ListItem
        v-for="platform in platforms"
        :key="platform.id"
      >
        <template #leftLabel>
          <ListItemLeftLabel :class="e('list-item-label')">
            {{ platform.title }}
          </ListItemLeftLabel>
        </template>
        <template
          v-if="readonly"
          #bodyLeftLabel
        >
          <ListItemBodyLeftLabel>
            <template v-if="urls[platform.id]">
              {{ urls[platform.id] }}
            </template>
            <Text
              v-else
              :class="e('no-url')"
            >
              {{ t('noURL') }}
            </Text>
          </ListItemBodyLeftLabel>
        </template>
        <template
          v-else
          #bodyInput
        >
          <ListItemBodyInput
            v-model:value="urls[platform.id]"
            :placeholder="t('optional')"
            :disabled="loading"
          />
        </template>
      </ListItem>
      <template #footer>
        {{ t('urlsFooter') }}
      </template>
    </List>
  </TransitionGroup>

  <Transition
    :css="false"
    @enter="onElementEnter"
    @leave="onElementLeave"
  >
    <HttpWarning
      v-if="hasHttpUrl"
      :class="e('list')"
    />
  </Transition>
  <HowItWorks :class="e('list')" />
</template>

<style lang="scss">
.app-urls-view {
  &__list {
    margin-top: 8px;
  }

  &__list-item-label {
    width: 80px;
  }

  &__no-url {
    color: var(--theme-subtitle-text-color);
  }

  &__section {
    margin-top: 16px;
  }
}
</style>
