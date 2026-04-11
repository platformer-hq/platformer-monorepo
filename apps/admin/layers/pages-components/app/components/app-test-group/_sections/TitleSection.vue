<script setup lang="ts">
defineProps<{
  disabled: boolean;
  loading: boolean;
}>();

const value = defineModel<string>({ required: true });

const { t } = useI18n({
  messages: {
    en: {
      title: 'Title',
      footer: 'Test group display name. It will only be visible to the application managers',
      placeholder: 'optional',
    },
    ru: {
      title: 'Заголовок',
      footer: 'Отображаемое имя тестовой группы. Оно будет видно только менеджерам приложения',
      placeholder: 'опционально',
    },
  },
});
</script>

<template>
  <AutoSection list-bg-color="section-bg" style="margin-top: 16px;">
    <template #header>
      <AutoSectionHeader>
        {{ t('title') }}
      </AutoSectionHeader>
    </template>
    <AutoList>
      <AutoListItem>
        <template v-if="loading" #bodyLeftLabel>
          <AutoListItemBodyLeftLabel>
            <TextShimmerBox :width="100"/>
          </AutoListItemBodyLeftLabel>
        </template>
        <template v-else #bodyLeftInput>
          <AutoListItemBodyLeftInput>
            <AutoListItemBodyLeftInputElement
              v-model="value"
              :placeholder="t('placeholder')"
              :disabled
            />
          </AutoListItemBodyLeftInput>
        </template>
      </AutoListItem>
    </AutoList>
    <template #footer>
      <AutoSectionFooter>
        {{ t('footer') }}
      </AutoSectionFooter>
    </template>
  </AutoSection>
</template>
