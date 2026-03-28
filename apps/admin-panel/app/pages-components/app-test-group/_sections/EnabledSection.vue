<script setup lang="ts">
defineProps<{ disabled: boolean }>();

const enabled = defineModel<boolean>({ required: true });

const platform = useTmaPlatform();
const { t } = useI18n({
  messages: {
    en: { title: 'Enabled' },
    ru: { title: 'Включена' },
  },
});
</script>

<template>
  <AutoSection list-bg-color="section-bg">
    <AutoList>
      <AutoListItem
        :clickable="platform.isMappedAndroid && !disabled"
        @click="
          if (platform.isMappedAndroid && !disabled) {
            enabled = !enabled;
            hapticSelectionChanged();
          }
        "
      >
        <template #bodyLeftLabel>
          <AutoListItemBodyLeftLabel>
            {{ t('title') }}
          </AutoListItemBodyLeftLabel>
        </template>
        <template #bodyRight>
          <AutoListItemBodyRight>
            <AutoSwitch v-model:checked="enabled" :disabled @click.stop @mousedown.stop/>
          </AutoListItemBodyRight>
        </template>
      </AutoListItem>
    </AutoList>
  </AutoSection>
</template>
