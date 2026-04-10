<script setup lang="ts">
import { popup } from '@tma.js/sdk-vue';
import * as v from 'valibot';

import { RevokeAppTransferRequestDocument } from './operations';

const { query, update: updateQuery } = useParsedQuery({
  appId: v.pipe(v.string(), v.transform(Number)),
  userSelectionNavId: v.nullish(v.pipe(v.string(), v.transform(Number))),
});

const { t } = useI18n({
  messages: {
    en: {
      'transfer.title': 'Application transfer',
      'transfer.footer': 'To transfer the application, you must select a user. After confirming the transfer request, the recipient will become the owner of the application, and you will be assigned the role of administrator',
      'transferButton.text': 'Transfer application',
      'transferButton.unavailable.title': 'Transfer unavailable',
      'transferButton.unavailable.subtitle.requestExists': 'Transfer request already exists',
      'transferButton.unavailable.subtitle.readonly': 'Not have not enough rights',
      'activeRequest.title': 'Active transfer request',
      'activeRequest.receiver': 'Sent to {name}',
      'activeRequest.footer': 'A transfer request has been sent to this user for your application. To complete the transfer, they need to open the admin panel and confirm the request',
      'deleteRequestConfirm.title': 'Confirm revoke',
      'deleteRequestConfirm.message': 'Are you sure you want to revoke app transfer request?',
      'deleteRequestConfirm.cancel': 'Cancel',
      'deleteRequestConfirm.confirm': 'Revoke request',
    },
    ru: {
      'transfer.title': 'Передача приложения',
      'transfer.footer': 'Для передачи приложения необходимо выбрать пользователя. После подтверждения запроса на передачу, получатель станет владельцем приложения, а Вы будете назначены на роль администратора',
      'transferButton.text': 'Передать приложение',
      'transferButton.unavailable.title': 'Передача невозможна',
      'transferButton.unavailable.subtitle.requestExists': 'Запрос на передачу уже существует',
      'transferButton.unavailable.subtitle.readonly': 'У Вас недостаточно прав',
      'activeRequest.title': 'Активный запрос на перенос',
      'activeRequest.receiver': 'Отправлен {name}',
      'activeRequest.footer': 'Этому пользователю был отправлен запрос на передачу Вашего приложения. Для завершения переноса, он должен войти в панель управления и подтвердить запрос',
      'deleteRequestConfirm.title': 'Подтвердите отзыв',
      'deleteRequestConfirm.message': 'Вы уверены, что хотите отозвать запрос на передачу владения приложением?',
      'deleteRequestConfirm.cancel': 'Отмена',
      'deleteRequestConfirm.confirm': 'Отозвать запрос',
    },
  },
});

const { options, setData } = useAppTransferPageQueryMeta();
const { data, isPending } = useQuery(() => options(query.value.appId));
const navigateToUserSelection = useNavigateToUserSelection();
const request = useMakeApiGqlRequest();
const { mutate: revokeTransferRequest, isLoading: isRevokingTransferRequest } = useMutation({
  key: [RevokeAppTransferRequestDocument],
  mutation(options: { requestId: number }) {
    return throwifyAnyEither(
      request(RevokeAppTransferRequestDocument, { requestId: options.requestId }),
    );
  },
  onSuccess() {
    hapticNotificationOccurred('success');
    setData(query.value.appId, prev => ({ ...prev, transferRequest: undefined }));
  },
  onError() {
    hapticNotificationOccurred('error');
  },
});

const readonly = computed(() => (
  !!data.value?.currentUserRole && !isEditorRole(data.value.currentUserRole)
));

const userSelectionNavId = query.value.userSelectionNavId || Math.random();
const activeRequestTransition = createReversibleTransition({
  animatedProperties: {
    opacity: [0, 1],
    transform: ['scale(0.98)', 'scale(1)'],
    marginTop: ['0px', '16px'],
  },
  animationOptions: { duration: 200, easing: 'ease-out' },
});
const handleRevokeRequest = async (requestId: number) => {
  if (
    await popup.show({
      title: t('deleteRequestConfirm.title'),
      message: t('deleteRequestConfirm.message'),
      buttons: [
        { id: 'no', type: 'default', text: t('deleteRequestConfirm.cancel') },
        { id: 'yes', type: 'destructive', text: t('deleteRequestConfirm.confirm') },
      ],
    }) === 'yes'
  ) {
    revokeTransferRequest({ requestId });
  }
};

watch(data, data => {
  if (data && !data.transferRequest) {
    preloadRouteComponents({ name: PageNames.AppTransferCreate });
  }
});

onMounted(() => {
  updateQuery({ userSelectionNavId }, { replace: true });
  preloadRouteComponents({ name: PageNames.App });
});
</script>

<template>
  <PageRoot colors="secondary-bg">
    <PageContent>
      <PagePaddings>
        <AutoSection list-bg-color="section-bg">
          <template #header>
            <AutoSectionHeader>
              {{ t('transfer.title') }}
            </AutoSectionHeader>
          </template>
          <AutoList>
            <AutoListItem v-if="data?.transferRequest || readonly" variant="placeholder" large>
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  {{ t('transferButton.unavailable.title') }}
                </AutoListItemBodyLeftLabel>
              </template>
              <template #bodyLeftSubtitle>
                <AutoListItemBodyLeftSubtitle>
                  {{ t(readonly
                    ? 'transferButton.unavailable.subtitle.readonly'
                    : 'transferButton.unavailable.subtitle.requestExists') }}
                </AutoListItemBodyLeftSubtitle>
              </template>
            </AutoListItem>
            <AutoListItem
              v-else
              :variant="isPending ? 'placeholder' : 'accent'"
              :clickable="!isPending"
              @click="!isPending && navigateToUserSelection({
                autoConfirmOnLimit: true,
                canAcceptAppTransfers: true,
                excludedUserIds: data?.currentUserId ? [data.currentUserId] : undefined,
                onConfirmAction: {
                  kind: 'navigate-to',
                  page: PageNames.AppTransferCreate,
                  query: { appId: query.appId },
                  replace: true,
                },
                limit: 1,
                navId: userSelectionNavId,
              })"
            >
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  {{ t('transferButton.text') }}
                </AutoListItemBodyLeftLabel>
              </template>
            </AutoListItem>
          </AutoList>
          <template #footer>
            <AutoSectionFooter>
              {{ t('transfer.footer') }}
            </AutoSectionFooter>
          </template>
        </AutoSection>

        <Transition v-bind="activeRequestTransition" :css="false">
          <AutoSection
            v-if="data?.transferRequest"
            list-bg-color="section-bg"
            style="margin-top: 16px"
          >
            <template #header>
              <AutoSectionHeader>
                {{ t('activeRequest.title') }}
              </AutoSectionHeader>
            </template>
            <AutoList>
              <AutoListItem :variant="isRevokingTransferRequest ? 'placeholder' : undefined">
                <template #bodyLeftLabel>
                  <AutoListItemBodyLeftLabel>
                    {{ t('activeRequest.receiver', { name: data.transferRequest.to.name }) }}
                    <ColorBox as="span" text="subtitle-text">
                      #{{ data.transferRequest.to.id }}
                    </ColorBox>
                  </AutoListItemBodyLeftLabel>
                </template>
                <template v-if="!readonly && !isRevokingTransferRequest" #bodyRight>
                  <AutoListItemBodyRight>
                    <AutoListItemBodyRightClear
                      @click="handleRevokeRequest(data.transferRequest.id)"
                    />
                  </AutoListItemBodyRight>
                </template>
              </AutoListItem>
            </AutoList>
            <template #footer>
              <AutoSectionFooter>
                {{ t('activeRequest.footer') }}
              </AutoSectionFooter>
            </template>
          </AutoSection>
        </Transition>
      </PagePaddings>
    </PageContent>
  </PageRoot>
</template>
