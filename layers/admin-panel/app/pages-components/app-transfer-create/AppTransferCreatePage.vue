<script setup lang="ts">
import * as fp from 'fp-ts';

import { CreateAppTransferRequestDocument } from './operations';

const { t } = useI18n({
  messages: {
    en: {
      title: 'Selected user',
      footer: 'After accepting the application transfer request, this user will become the owner, and you will be assigned as an administrator.',
      button: 'Create transfer request',
    },
    ru: {
      title: 'Выбранный пользователь',
      footer: 'После принятия запроса на перенос, этот пользователь станет его владельцем, а Вы будете назначены администратором.',
      button: 'Создать запрос на перенос',
    },
  },
});
const appId = useQueryAppId();
const router = useRouter();
const user = useUserSelectionStore().selectedUsers![0]!;
const { setData: setAppTransferPageQueryData } = useAppTransferPageQueryMeta();
const request = useMakeGqlApiRequest();
const { mutate: createTransferRequest, isLoading: isCreatingTransferRequest } = useMutation({
  key: [CreateAppTransferRequestDocument],
  mutation(options: { appId: number; userId: number }) {
    return throwifyAnyEither(
      fp.function.pipe(
        request(CreateAppTransferRequestDocument, {
          appId: options.appId,
          toUserId: options.userId,
        }),
        fp.taskEither.map(r => r.createAppTransferRequest),
      ),
    );
  },
  onSuccess({ from, id, to }) {
    hapticNotificationOccurred('success');
    setAppTransferPageQueryData(appId.value, prev => ({
      ...prev,
      transferRequest: { id, from, to },
    }));
    router.back();
  },
  onError() {
    hapticNotificationOccurred('error');
  },
});

onMounted(() => {
  preloadRouteComponents({ name: PageNames.AppTransfer });
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
            <AutoListItem>
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  {{ user.name }}
                  <ColorBox as="span" color="subtitle-text">
                    #{{ user.id }}
                  </ColorBox>
                </AutoListItemBodyLeftLabel>
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
        <BottomBar>
          <PageContent>
            <BottomBarInner>
              <AutoButton
                palette="filled"
                full-width
                :active="!isCreatingTransferRequest"
                :disabled="isCreatingTransferRequest"
                @click="createTransferRequest({appId, userId: user.id})"
              >
                <AutoTypography variant="body" weight="medium">
                  {{ t('button') }}
                </AutoTypography>
                <ButtonLoadingIndicator :show="isCreatingTransferRequest"/>
              </AutoButton>
            </BottomBarInner>
          </PageContent>
        </BottomBar>
      </BottomBarTransition>
    </template>
  </PageRoot>
</template>
