<script setup lang="ts">
import { Translation } from '#i18n';

defineProps<{
  readonly: boolean;
  refreshing: boolean;
  disabled: boolean;
  shimmerEnabled: boolean;
}>();

const value = defineModel<string>({ required: true });

const { t } = useI18n({
  messages: {
    en: {
      title: 'URL',
      footer: 'Link that will be opened whenever test group users visit the application. It must either have {0} or {1} protocol',
      placeholder: 'required',
    },
    ru: {
      title: 'Ссылка',
      footer: 'Ссылка, которая будет использована для показа пользователям из тестовой группы. Она должна иметь {0} или {1} протокол',
      placeholder: 'обязательно',
    },
  },
});
</script>

<template>
  <AutoSection list-bg-color="section-bg" style="margin-top: 16px">
    <template #header>
      <AutoSectionHeader>
        {{ t('title') }}
      </AutoSectionHeader>
    </template>
    <AutoList>
      <AutoListItem>
         <template v-if="refreshing && !value && shimmerEnabled" #bodyLeftLabel>
          <AutoListItemBodyLeftLabel>
            <TextShimmerBox :width="100"/>
          </AutoListItemBodyLeftLabel>
        </template>
        <template v-else-if="readonly" #bodyLeftLabel>
          <AutoListItemBodyLeftLabel>
            {{ value }}
          </AutoListItemBodyLeftLabel>
        </template>
        <template v-else #bodyLeftInput>
          <AutoListItemBodyLeftInput :variant="disabled ? 'disabled' : 'regular'">
            <AutoListItemBodyLeftInputElement
              v-model="value"
              :placeholder="t('placeholder')"
              :disabled
              type="url"
              autocorrect="off"
            />
          </AutoListItemBodyLeftInput>
        </template>
      </AutoListItem>
    </AutoList>
    <template #footer>
      <AutoSectionFooter>
        <Translation keypath="footer">
          <b>HTTP</b>
          <b>HTTPS</b>
        </Translation>
      </AutoSectionFooter>
    </template>
  </AutoSection>
</template>
