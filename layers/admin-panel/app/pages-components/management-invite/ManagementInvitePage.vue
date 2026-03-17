<script setup lang="ts">
import * as fp from 'fp-ts';
import * as v from 'valibot';

import { RespondManagementInviteDocument } from './operations';

const { t } = useI18n({
  messages: {
    en: {
      title: 'Invite information',
      app: 'Application',
      sender: 'Sender',
      'role.title': 'Role',
      'role.admin': 'Admin',
      'role.member': 'Member',
      'button.accept': 'Accept',
      'button.decline': 'Decline',
    },
    ru: {
      title: 'Информация о приглашении',
      app: 'Приложение',
      sender: 'Отправитель',
      'role.title': 'Роль',
      'role.admin': 'Админ',
      'role.member': 'Участник',
      'button.accept': 'Принять',
      'button.decline': 'Отклонить',
    },
  },
});
const { query } = useParsedQuery({
  inviteId: v.pipe(v.string(), v.transform(Number)),
  app: v.pipe(v.string(), v.parseJson(), v.looseObject({
    id: v.number(),
    title: v.string(),
  })),
  sender: v.pipe(v.string(), v.parseJson(), v.looseObject({ id: v.number(), name: v.string() })),
  role: v.enum(LocalAppManagementInviteRole),
});
const isPageEntered = useIsCurrentPageEntered();

//#region Requests.
const request = useMakeGqlApiRequest();
const router = useRouter();
const { setData: setManagementInvitesPageQueryData } = useManagementInvitesPageQueryMeta();
const { invalidate: invalidateAppsPageQuery } = useAppsPageQueryMeta();
const { mutate: respondInvite, isLoading: isResponding } = useMutation({
  key: [RespondManagementInviteDocument],
  mutation(options: { accept: boolean; inviteId: number }) {
    return throwifyAnyEither(
      fp.function.pipe(
        request(RespondManagementInviteDocument, {
          inviteId: options.inviteId,
          accept: options.accept,
        }),
        fp.taskEither.map(r => r.respondAppManagementInvite),
      ),
    );
  },
  onSuccess(_, { inviteId }) {
    hapticNotificationOccurred('success');
    setManagementInvitesPageQueryData(data => data.filter(item => item.id !== inviteId));
    invalidateAppsPageQuery();
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
  respondInvite({ inviteId: query.value.inviteId, accept: value });
};
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

          <AutoListItem large>
            <template #bodyLeft>
              <AutoListItemBodyLeft reversed>
                <template #label>
                  <AutoListItemBodyLeftLabel>
                    {{ {
                      [LocalAppManagementInviteRole.Admin]: t('role.admin'),
                      [LocalAppManagementInviteRole.Member]: t('role.member'),
                    }[query.role] }}
                  </AutoListItemBodyLeftLabel>
                </template>
                <template #subtitle>
                  <AutoListItemBodyLeftSubtitle>
                    {{ t('role.title') }}
                  </AutoListItemBodyLeftSubtitle>
                </template>
              </AutoListItemBodyLeft>
            </template>
          </AutoListItem>
        </AutoSection>
      </PagePaddings>
    </PageContent>
    <template #bottomBar>
      <BottomBarTransition>
        <BottomBar v-if="isPageEntered">
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
        </BottomBar>
      </BottomBarTransition>
    </template>
  </PageRoot>
</template>
