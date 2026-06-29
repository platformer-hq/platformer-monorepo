<script setup lang="ts">
defineProps<{
  readonly: boolean;
  refreshing: boolean;
  disabled: boolean;
  shimmerEnabled: boolean;
  maxLength?: number;
}>();

const value = defineModel<string>({ required: true });

const { t } = useI18n({
  messages: {
    en: {
      'footer.unlimited': 'Function name used to call the function. Allowed characters: Latin letters (A–Z, a–z) and digits (0–9). The first character must be a letter.',
      'footer.limited': [
        'Function name used to call the function. Maximum length: {count} character. Allowed characters: Latin letters (A–Z, a–z) and digits (0–9). The first character must be a letter.',
        'Function name used to call the function. Maximum length: {count} characters. Allowed characters: Latin letters (A–Z, a–z) and digits (0–9). The first character must be a letter.',
      ].join(' | '),
      placeholder: 'required',
    },
    ru: {
      'footer.limited': [
        'Имя функции, используемое для её вызова. Максимальная длина — {count} символов. Допустимые символы: латинские буквы (A–Z, a–z) и цифры (0–9). Первый символ должен быть буквой.',
        'Имя функции, используемое для её вызова. Максимальная длина — {count} символ. Допустимые символы: латинские буквы (A–Z, a–z) и цифры (0–9). Первый символ должен быть буквой.',
        'Имя функции, используемое для её вызова. Максимальная длина — {count} символа. Допустимые символы: латинские буквы (A–Z, a–z) и цифры (0–9). Первый символ должен быть буквой.',
        'Имя функции, используемое для её вызова. Максимальная длина — {count} символов. Допустимые символы: латинские буквы (A–Z, a–z) и цифры (0–9). Первый символ должен быть буквой.',
      ].join(' | '),
      placeholder: 'обязательно',
    },
  },
});

const { e } = bem('app-function-page-name-section');
</script>

<template>
  <AutoSection list-bg-color="section-bg" style="margin-top: 16px;">
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
              autocorrect="off"
            />
          </AutoListItemBodyLeftInput>
        </template>
      </AutoListItem>
    </AutoList>
    <template #footer>
      <AutoSectionFooter :class="e('footer')">
        {{ maxLength ? t('footer.limited', {count: maxLength}) : t('footer.unlimited') }}
      </AutoSectionFooter>
    </template>
  </AutoSection>
</template>

<style lang="scss">
.app-function-page-name-section {
  &__footer {
    white-space: pre-line;
  }
}
</style>
