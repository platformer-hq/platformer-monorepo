<script setup lang="ts">
const props = defineProps<{
  action?: 'retry' | 'redirect' | 'redirecting';
}>();
defineEmits<{
  retry: [];
  redirect: [];
}>();

const { t } = useI18n({
  messages: {
    en: {
      'button.label.retry': 'Try again',
      'button.label.redirect': 'Redirect',
      'button.label.redirecting': 'Redirecting',
    },
    ru: {
      'button.label.retry': 'Попробовать снова',
      'button.label.redirect': 'Перенаправить',
      'button.label.redirecting': 'Перенаправляем',
    },
  },
});

const isButtonEnabled = computed(() => props.action !== 'redirecting');
</script>

<template>
  <BottomBarTransition>
    <BottomBar v-if="action">
      <BottomBarInner>
        <VButton
          :palette="isButtonEnabled ? 'filled' : 'disabled'"
          full-width
          :active="isButtonEnabled"
          :disabled="!isButtonEnabled"
          @click="action === 'redirect' ? $emit('redirect') : $emit('retry')"
        >
          <VTypography variant="body" weight="semibold">
            {{ t({
              retry: 'button.label.retry',
              redirect: 'button.label.redirect',
              redirecting: 'button.label.redirecting',
            }[action]) }}
          </VTypography>
          <ButtonLoadingIndicator :show="action === 'redirecting'"/>
        </VButton>
      </BottomBarInner>
    </BottomBar>
  </BottomBarTransition>
</template>
