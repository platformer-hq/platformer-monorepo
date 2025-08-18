<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import List from '@/ui/adapters/List.js';
import ListItem from '@/ui/adapters/ListItem.js';
import ListItemBody from '@/ui/adapters/ListItemBody';
import ListItemBodyLeft from '@/ui/adapters/ListItemBodyLeft';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel';
import ListItemBodyLeftSubtitle from '@/ui/adapters/ListItemBodyLeftSubtitle';
import ListItemBodyRight from '@/ui/adapters/ListItemBodyRight';
import ListItemBodyRightCheckmark from '@/ui/adapters/ListItemBodyRightCheckmark';
import Page from '@/ui/components/Page.vue';
import PageLoading from '@/ui/components/PageLoading.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';

import ListItemLocal from './ListItem.vue';
import { useProfileViewQueryOptions } from './query-options';

const { data } = useQuery(useProfileViewQueryOptions());
const { t, locale } = useI18n({
  messages: {
    en: {
      name: 'Name',
      firstName: 'First name',
      lastName: 'Last name',
      userName: 'User name',
      publicTitle: 'Public information',
      publicFooter: 'This data is public and visible to all Platformer users.',
      tgTitle: 'Telegram account data',
      tgFooter: 'This data is private and visible only to you.',
      langTitle: 'Interface language',
    },
    ru: {
      name: 'Имя',
      firstName: 'Имя',
      lastName: 'Фамилия',
      userName: 'Логин',
      publicTitle: 'Публичная информация',
      publicFooter: 'Эти данные публичны и видны всем пользователям Платформера.',
      tgTitle: 'Данные Telegram',
      tgFooter: 'Эти данные приватны и видны только Вам.',
      langTitle: 'Язык интерфейса',
    },
  },
});
const publicRows = computed(() => [
  { title: 'ID', prop: 'id' },
  { title: t('name'), prop: 'name' },
] as const);
const tgRows = computed(() => [
  { title: 'ID', prop: 'id' },
  { title: t('firstName'), prop: 'firstName' },
  { title: t('lastName'), prop: 'lastName' },
  { title: t('userName'), prop: 'login' },
] as const);

// TODO: The language is saved nowhere.
</script>

<template>
  <Page>
    <PagePaddings>
      <PageLoading v-if="!data" />
      <template v-else>
        <List :title="t('publicTitle')">
          <ListItemLocal
            v-for="item in publicRows"
            :key="item.prop"
            :left-label="item.title"
            :label="data[item.prop]"
          />
          <template #footer>
            {{ t('publicFooter') }}
          </template>
        </List>
        <List
          v-if="data.telegramData"
          class="profile-view__list"
          :title="t('tgTitle')"
        >
          <ListItemLocal
            v-for="item in tgRows"
            :key="item.prop"
            :left-label="item.title"
            :label="data.telegramData[item.prop]"
          />
          <template #footer>
            {{ t('tgFooter') }}
          </template>
        </List>
        <List
          class="profile-view__list"
          :title="t('langTitle')"
        >
          <ListItem
            v-for="item in [
              { title: 'English', subtitle: 'English', locale: 'en' },
              { title: 'Russian', subtitle: 'Русский', locale: 'ru' },
            ]"
            :key="item.locale"
            clickable
            large
            @click="$i18n.locale = item.locale"
          >
            <template #body>
              <ListItemBody>
                <template #left>
                  <ListItemBodyLeft>
                    <template #label>
                      <ListItemBodyLeftLabel>
                        {{ item.title }}
                      </ListItemBodyLeftLabel>
                    </template>
                    <template #subtitle>
                      <ListItemBodyLeftSubtitle>
                        {{ item.subtitle }}
                      </ListItemBodyLeftSubtitle>
                    </template>
                  </ListItemBodyLeft>
                </template>
                <template
                  v-if="item.locale === locale"
                  #right
                >
                  <ListItemBodyRight>
                    <template #checkmark>
                      <ListItemBodyRightCheckmark />
                    </template>
                  </ListItemBodyRight>
                </template>
              </ListItemBody>
            </template>
          </ListItem>
        </List>
      </template>
    </PagePaddings>
  </Page>
</template>

<style>
.profile-view__list {
  margin-top: 16px;
}
</style>
