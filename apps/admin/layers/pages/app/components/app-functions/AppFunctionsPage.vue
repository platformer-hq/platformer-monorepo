<script setup lang="ts">
import { popup } from '@tma.js/sdk-vue';

const props = defineProps<{
  appId: number;
}>();

const { t } = useI18n({
  messages: {
    en: {
      title: 'Functions',
      create: 'Create function',
      'function.enabled': 'Enabled',
      'function.disabled': 'Disabled',
      footer: 'Functions run on Platformer\'s servers and can be called by your mini application. Results are returned to your app.',
      'limitPopup.message': 'You\'ve reached your functions limit for this application.',
    },
    ru: {
      title: 'Функции',
      create: 'Создать функцию',
      'function.enabled': 'Включена',
      'function.disabled': 'Отключена',
      footer: 'Функции запускаются на серверах Платформер и могут быть вызваны Вашим мини-приложением. Результат будет возвращен приложению.',
      'limitPopup.message': 'Вы достигли лимита функций для данного приложения.',
    },
  },
});

const { options } = useAppFunctionsPageQueryMeta();
const { data } = useQuery(() => options(props.appId));
const hadInitialData = !!data.value;

const readonly = computed(() => !data.value || !isEditorRole(data.value.currentUserRole));
const handleCreate = async () => {
  if (!data.value) {
    return;
  }
  const { maxFunctionsCount: maxStoredFunctionsCount } = data.value;
  if (
    typeof maxStoredFunctionsCount === 'number'
    && data.value.functions.length >= maxStoredFunctionsCount
  ) {
    await popup.show({ message: t('limitPopup.message') });
    return;
  }
  navigateToAppFunctionPage({ appId: props.appId });
};

watch(() => data.value?.functions, storedFunctions => {
  storedFunctions?.forEach(fn => {
    preloadAppFunctionPage({ appId: props.appId, fnId: fn.id });
  });
});

watch(() => props.appId, appId => {
  preloadAppFunctionPage({ appId });
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
                ({{ data.functions.length }} / {{ data.maxFunctionsCount ?? '∞' }})
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
                  v-for="(itemOrWidth, idx) in data?.functions || [210, 180, 160]"
                  :key="hadInitialData && typeof itemOrWidth === 'object'
                    ? itemOrWidth.id
                    : idx"
                  :clickable="typeof itemOrWidth === 'object'"
                  @click="typeof itemOrWidth === 'object' && navigateToAppFunctionPage({
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
