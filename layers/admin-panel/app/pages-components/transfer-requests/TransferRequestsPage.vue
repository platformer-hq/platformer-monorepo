<script setup lang="ts">
const { t } = useI18n({
  messages: {
    en: {
      title: 'App transfer requests',
      footer: 'A list of requests for applications sent to you by other users',
      'request.subtitle': 'From {name}',
      empty: 'You have no app transfer requests',
    },
    ru: {
      title: 'Запросы на получение приложений',
      footer: 'Список запросов на получение приложений, отправленных Вам другими пользователями',
      'request.subtitle': 'От {name}',
      empty: 'У Вас нет запросов на получение приложений',
    },
  },
});

const { data } = useQuery(useTransferRequestsPageQueryMeta().options);
const initialData = data.value;
const hasInitialData = !!initialData;

const requests = computed(() => {
  if (!data.value) {
    return [210, 180, 160].map((width, idx) => ({ kind: 'width' as const, key: idx, width }));
  }
  if (!data.value.length) {
    return [{ kind: 'empty' as const, key: initialData?.[0]?.id || 0 }];
  }
  return data.value.map((request, idx) => ({
    kind: 'request' as const,
    key: hasInitialData ? request.id : idx,
    request,
  }));
});

watch(requests, requests => {
  if (requests[0]?.kind === 'request') {
    preloadRouteComponents({ name: PageNames.TransferRequest });
  }
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
            </AutoSectionHeader>
          </template>
          <TransitionGroup :css="false" v-bind="createListItemTransition()">
            <AutoListItem
              v-for="item in requests"
              :key="item.key"
              :large="item.kind !== 'empty'"
              :clickable="item.kind === 'request'"
              @click="item.kind === 'request' && navigateTo({
                name: PageNames.TransferRequest,
                query: {
                  requestId: item.request.id,
                  app: JSON.stringify({
                    id: item.request.app.id,
                    title: item.request.app.title,
                  }),
                  sender: JSON.stringify({
                    id: item.request.from.id,
                    name: item.request.from.name,
                  }),
                },
              })"
            >
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  <template v-if="item.kind === 'request'">
                    {{ item.request.app.title }}
                    <ColorBox as="span" text="subtitle-text">
                      #{{ item.request.app.id }}
                    </ColorBox>
                  </template>
                  <TextShimmerBox
                    v-else-if="item.kind === 'width'"
                    variant="body"
                    :width="item.width"
                  />
                  <template v-else>
                    {{ t('empty') }}
                  </template>
                </AutoListItemBodyLeftLabel>
              </template>
              <template #bodyLeftSubtitle>
                <AutoListItemBodyLeftSubtitle :max-lines="1">
                  <template v-if="item.kind === 'request'">
                    {{ t('request.subtitle', {
                      name: `${item.request.from.name} #${item.request.from.id}`,
                    }) }}
                  </template>
                  <TextShimmerBox
                    v-else-if="item.kind === 'width'"
                    variant="subheadline1"
                    :width="item.width / 2"
                  />
                </AutoListItemBodyLeftSubtitle>
              </template>
              <template v-if="item.kind === 'request'" #bodyRight>
                <AutoListItemBodyRight>
                  <AutoListItemBodyRightChevron/>
                </AutoListItemBodyRight>
              </template>
            </AutoListItem>
          </TransitionGroup>
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
