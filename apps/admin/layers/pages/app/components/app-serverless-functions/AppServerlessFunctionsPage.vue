<script setup lang="ts">
import { popup } from '@tma.js/sdk-vue';

const props = defineProps<{
  appId: number;
}>();

const { t } = useI18n({
  messages: {
    en: {
      title: 'Serverless Functions',
      create: 'Create serverless function',
      'function.enabled': 'Enabled',
      'function.disabled': 'Disabled',
      footer: 'Serverless functions run on Platformer\'s servers and can be called by your mini application. Results are returned to your app.',
      'limitPopup.message': 'You\'ve reached your serverless function limit for this application.',
    },
    ru: {
      title: 'Serverless-функции',
      create: 'Создать serverless-функцию',
      'function.enabled': 'Включена',
      'function.disabled': 'Отключена',
      footer: 'Serverless-функции запускаются на серверах Платформер и могут быть вызваны Вашим мини-приложением. Результат будет возвращен приложению.',
      'limitPopup.message': 'Вы достигли лимита serverless-функций для данного приложения.',
    },
  },
});

const { options } = useAppServerlessFunctionsPageQueryMeta();
const { data } = useQuery(() => options(props.appId));
const hadInitialData = !!data.value;

const readonly = computed(() => !data.value || !isEditorRole(data.value.currentUserRole));
const handleCreate = async () => {
  if (!data.value) {
    return;
  }
  const { maxServerlessFunctionsCount: maxStoredFunctionsCount } = data.value;
  if (
    typeof maxStoredFunctionsCount === 'number'
    && data.value.serverlessFunctions.length >= maxStoredFunctionsCount
  ) {
    await popup.show({ message: t('limitPopup.message') });
    return;
  }
  navigateToAppServerlessFunctionPage({ appId: props.appId });
};

watch(() => data.value?.serverlessFunctions, storedFunctions => {
  storedFunctions?.forEach(fn => {
    preloadAppServerlessFunctionPage({ appId: props.appId, fnId: fn.id });
  });
});

watch(() => props.appId, appId => {
  preloadAppServerlessFunctionPage({ appId });
});
</script>

<template>
  <PageRoot colors="secondary-bg">
    <PageContent>
      <PagePaddings>
        <AutoSection list-bg-color="section-bg">
          <template #header>
            <AutoSectionHeader>
              {{ t('title') }}
              <template v-if="data">
                ({{ data.serverlessFunctions.length }} / {{ data.maxServerlessFunctionsCount ?? '∞' }})
              </template>
              <TextShimmerBox
                v-else
                as="span"
                display="inline-block"
                :width="40"
                margin="0 0 0 5px"
              />
            </AutoSectionHeader>
          </template>
          <AutoList>
            <AutoListItem
              :clickable="!!data && !readonly"
              :variant="data && !readonly ? 'accent' : 'placeholder'"
              @click="data && !readonly && handleCreate()"
            >
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  {{ t('create') }}
                </AutoListItemBodyLeftLabel>
              </template>
            </AutoListItem>
            <UseListItemTransition v-slot="transition">
              <TransitionGroup v-bind="transition" :css="false">
                <AutoListItem
                  v-for="(itemOrWidth, idx) in data?.serverlessFunctions || [210, 180, 160]"
                  :key="hadInitialData && typeof itemOrWidth === 'object'
                    ? itemOrWidth.id
                    : idx"
                  :clickable="typeof itemOrWidth === 'object'"
                  @click="typeof itemOrWidth === 'object' && navigateToAppServerlessFunctionPage({
                    appId,
                    fnId: itemOrWidth.id,
                  })"
                >
                  <template #bodyLeftLabel>
                    <AutoListItemBodyLeftLabel>
                      <template v-if="typeof itemOrWidth === 'object'">
                        {{ itemOrWidth.name }}
                      </template>
                      <TextShimmerBox v-else :width="itemOrWidth"/>
                    </AutoListItemBodyLeftLabel>
                  </template>
                  <template #bodyRight>
                    <AutoListItemBodyRight>
                      <AutoListItemBodyRightLabel>
                        <template v-if="typeof itemOrWidth === 'object'">
                          {{ itemOrWidth.enabled
                            ? t('function.enabled')
                            : t('function.disabled') }}
                        </template>
                        <TextShimmerBox v-else :width="80"/>
                      </AutoListItemBodyRightLabel>
                      <WhenIos v-if="typeof itemOrWidth === 'object'">
                        <AutoListItemBodyRightChevron/>
                      </WhenIos>
                    </AutoListItemBodyRight>
                  </template>
                </AutoListItem>
              </TransitionGroup>
            </UseListItemTransition>
          </AutoList>
          <template #footer>
            <AutoSectionFooter>
              {{ t('footer') }}
            </AutoSectionFooter>
          </template>
        </AutoSection>
      </PagePaddings>
    </PageContent>
  </PageRoot>
</template>
