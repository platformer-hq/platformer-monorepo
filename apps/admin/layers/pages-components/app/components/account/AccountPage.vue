<script setup lang="ts">
import * as fp from 'fp-ts';

import { AccountPageDataDocument } from './operations';

const { e } = bem('account-page');
const platform = useTmaPlatform();
const { t, locale, setLocale } = useI18n({
  messages: {
    en: {
      'public.id': 'Identifier',
      'public.title': 'Public information',
      'public.name': 'Name',
      'public.footer': 'This data is public and visible to all Platformer users',
      'tg.id': 'Identifier',
      'tg.title': 'Telegram account data',
      'tg.firstName': 'First name',
      'tg.lastName': 'Last name',
      'tg.userName': 'User name',
      'tg.footer': 'This data is private and visible only to you',
      'lang.title': 'Interface language',
      'lang.ru': 'Russian',
      'lang.en': 'English',
    },
    ru: {
      'public.id': 'Идентификатор',
      'public.title': 'Публичная информация',
      'public.name': 'Имя',
      'public.footer': 'Эти данные публичны и видны всем пользователям Платформера',
      'tg.id': 'Идентификатор',
      'tg.title': 'Данные Telegram',
      'tg.firstName': 'Имя',
      'tg.lastName': 'Фамилия',
      'tg.userName': 'Логин',
      'tg.footer': 'Эти данные приватны и видны только Вам',
      'lang.title': 'Язык интерфейса',
      'lang.ru': 'Русский',
      'lang.en': 'Английский',
    },
  },
});
const request = useMakeApiGqlRequest();
const { data, isPending } = useQuery({
  key: [AccountPageDataDocument],
  query: throwify(() => {
    return fp.function.pipe(
      request(AccountPageDataDocument, {}),
      fp.taskEither.map(({ currentUser }) => {
        const { telegramData } = currentUser;
        return {
          id: currentUser.id,
          name: currentUser.name,
          telegramData: telegramData
            ? {
              id: telegramData.id || undefined,
              firstName: telegramData.firstName || undefined,
              lastName: telegramData.lastName || undefined,
              login: telegramData.login || undefined,
            }
            : undefined,
        };
      }),
    );
  }),
});

const sections = computed(() => {
  const telegramData = data.value?.telegramData;
  return [
    {
      title: t('public.title'),
      fields: [
        { title: t('public.id'), value: data.value?.id },
        { title: t('public.name'), value: data.value?.name },
      ],
      footer: t('public.footer'),
    },
    {
      title: t('tg.title'),
      fields: [
        { title: t('tg.id'), value: telegramData?.id },
        { title: t('tg.firstName'), value: telegramData?.firstName },
        { title: t('tg.lastName'), value: telegramData?.lastName },
        { title: t('tg.userName'), value: telegramData?.login },
      ],
      footer: t('tg.footer'),
    },
  ];
});

const saveLocale = async (locale: 'ru' | 'en') => {
  await Promise.all([
    setLocale(locale),
    csSaveLocale(locale)(),
  ]);
};
</script>

<template>
  <PageRoot colors="secondary-bg">
    <PageContent>
      <PagePaddings>
        <AutoSection
          v-for="(section, sectionIdx) in sections"
          :key="sectionIdx"
          list-bg-color="section-bg"
          :class="e('section', sectionIdx > 0 && 'margin-top')"
        >
          <template #header>
            <AutoSectionHeader>
              {{ section.title }}
            </AutoSectionHeader>
          </template>
          <AutoList>
            <AutoListItem v-for="field in section.fields" :key="field.title" large>
              <template #bodyLeft>
                <AutoListItemBodyLeft reversed>
                  <template #subtitle>
                    <AutoListItemBodyLeftSubtitle>
                      {{ platform.isMappedIos ? field.title.toLowerCase() : field.title }}
                    </AutoListItemBodyLeftSubtitle>
                  </template>
                  <template #label>
                    <AutoListItemBodyLeftLabel>
                      <template v-if="!isPending">
                        {{ field.value || '' }}
                      </template>
                      <TextShimmerBox v-else width="100px" border-radius="6px"/>
                    </AutoListItemBodyLeftLabel>
                  </template>
                </AutoListItemBodyLeft>
              </template>
            </AutoListItem>
          </AutoList>
          <template #footer>
            <AutoSectionFooter>
              {{ section.footer }}
            </AutoSectionFooter>
          </template>
        </AutoSection>
        <AutoSection :class="e('section', 'margin-top')" list-bg-color="section-bg">
          <template #header>
            <AutoSectionHeader>
              {{ t('lang.title') }}
            </AutoSectionHeader>
          </template>
          <AutoList>
            <AutoListItem
              v-for="item in [
                { title: t('lang.en'), subtitle: 'English', locale: 'en' as const },
                { title: t('lang.ru'), subtitle: 'Русский', locale: 'ru' as const },
              ]"
              :key="item.locale"
              large
              clickable
              @click="saveLocale(item.locale)"
            >
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  {{ item.title }}
                </AutoListItemBodyLeftLabel>
              </template>
              <template #bodyLeftSubtitle>
                <AutoListItemBodyLeftSubtitle>
                  {{ item.subtitle }}
                </AutoListItemBodyLeftSubtitle>
              </template>
              <template v-if="item.locale === locale" #bodyRight>
                <AutoListItemBodyRight>
                  <AutoListItemBodyRightCheckmark/>
                </AutoListItemBodyRight>
              </template>
            </AutoListItem>
          </AutoList>
        </AutoSection>
      </PagePaddings>
    </PageContent>
  </PageRoot>
</template>

<style lang="scss">
.account-page {
  &__section {
    &--margin-top {
      margin-top: 16px;
    }
  }
}
</style>
