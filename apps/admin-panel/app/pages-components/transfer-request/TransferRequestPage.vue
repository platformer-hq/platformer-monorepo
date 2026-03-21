<script setup lang="ts">
import * as fp from 'fp-ts';
import * as v from 'valibot';

import { RespondAppTransferRequestDocument } from './operations';

const { t } = useI18n({
  messages: {
    en: {
      title: 'Request information',
      footer: 'After accepting the application transfer request, you will become its owner',
      app: 'Application',
      sender: 'Sender',
      'button.accept': 'Accept',
      'button.decline': 'Decline',
    },
    ru: {
      title: 'Информация о запросе',
      footer: 'После принятия запроса на передачу приложения, Вы станете его владельцем',
      app: 'Приложение',
      sender: 'Отправитель',
      'button.accept': 'Принять',
      'button.decline': 'Отклонить',
    },
  },
});
const { query } = useParsedQuery({
  requestId: v.pipe(v.string(), v.transform(Number)),
  app: v.pipe(v.string(), v.parseJson(), v.looseObject({
    id: v.number(),
    title: v.string(),
  })),
  sender: v.pipe(v.string(), v.parseJson(), v.looseObject({ id: v.number(), name: v.string() })),
});
const isPageEntered = useIsCurrentPageEntered();

//#region Requests.
const request = useMakeApiGqlRequest();
const router = useRouter();
const { setData: setTransferRequestsPageQueryData } = useTransferRequestsPageQueryMeta();
const { invalidate: invalidateAppsPageQuery } = useAppsPageQueryMeta();
const { mutate: respondRequest, isLoading: isResponding } = useMutation({
  key: [RespondAppTransferRequestDocument],
  mutation(options: { accept: boolean; requestId: number }) {
    return throwifyAnyEither(
      fp.function.pipe(
        request(RespondAppTransferRequestDocument, {
          requestId: options.requestId,
          accept: options.accept,
        }),
        fp.taskEither.map(r => r.respondAppTransferRequest),
      ),
    );
  },
  onSuccess(_, { requestId, accept }) {
    hapticNotificationOccurred('success');
    setTransferRequestsPageQueryData(data => data.filter(item => item.id !== requestId));
    if (accept) {
      invalidateAppsPageQuery();
    }
    router.back();
  },
  onError() {
    hapticNotificationOccurred('error');
  },
  onSettled() {
    accept.value = undefined;
  },
});
//#endregion

const accept = ref<boolean>();

const respond = (value: boolean) => {
  accept.value = value;
  respondRequest({ requestId: query.value.requestId, accept: value });
};

onMounted(() => {
  preloadRouteComponents({ name: PageNames.TransferRequests });
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

          <AutoList>
            <AutoListItem large>
              <template #bodyLeft>
                <AutoListItemBodyLeft reversed>
                  <template #label>
                    <AutoListItemBodyLeftLabel>
                      {{ query.app.title }}
                      <ColorBox as="span" text="subtitle-text">
                        #{{ query.app.id }}
                      </ColorBox>
                    </AutoListItemBodyLeftLabel>
                  </template>
                  <template #subtitle>
                    <AutoListItemBodyLeftSubtitle>
                      {{ t('app') }}
                    </AutoListItemBodyLeftSubtitle>
                  </template>
                </AutoListItemBodyLeft>
              </template>
            </AutoListItem>

            <AutoListItem large>
              <template #bodyLeft>
                <AutoListItemBodyLeft reversed>
                  <template #label>
                    <AutoListItemBodyLeftLabel>
                      {{ query.sender.name }}
                      <ColorBox as="span" text="subtitle-text">
                        #{{ query.sender.id }}
                      </ColorBox>
                    </AutoListItemBodyLeftLabel>
                  </template>
                  <template #subtitle>
                    <AutoListItemBodyLeftSubtitle>
                      {{ t('sender') }}
                    </AutoListItemBodyLeftSubtitle>
                  </template>
                </AutoListItemBodyLeft>
              </template>
            </AutoListItem>
          </AutoList>

          <template #footer>
            <AutoSectionFooter>
              {{ t('footer') }}
            </AutoSectionFooter>
          </template>
        </AutoSection>
      </PagePaddings>
    </PageContent>
    <template #bottomBar>
      <BottomBarTransition>
        <BottomBar v-if="isPageEntered">
          <PageContent>
            <BottomBarInner variant="2-columns">
              <AutoButton
                :palette="isResponding ? 'disabled' : 'tinted'"
                :disabled="isResponding"
                :active="!isResponding"
                @click="respond(false)"
              >
                <AutoTypography variant="body" weight="medium">
                  {{ t('button.decline') }}
                </AutoTypography>
                <ButtonLoadingIndicator :show="accept === false"/>
              </AutoButton>
              <AutoButton
                :palette="isResponding ? 'disabled' : 'filled'"
                :disabled="isResponding"
                :active="!isResponding"
                @click="respond(true)"
              >
                <AutoTypography variant="body" weight="medium">
                  {{ t('button.accept') }}
                </AutoTypography>
                <ButtonLoadingIndicator :show="accept === true"/>
              </AutoButton>
            </BottomBarInner>
          </PageContent>
        </BottomBar>
      </BottomBarTransition>
    </template>
  </PageRoot>
</template>
