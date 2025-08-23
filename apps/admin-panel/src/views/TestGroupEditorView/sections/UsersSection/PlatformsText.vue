<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
  platforms: string[];
}>();

useI18n({
  messages: {
    en: {
      text: 'Opening your application in {0}, Platformer will use the test group URL for these users to display the application.',
    },
    ru: {
      text: 'При открытии приложения в {0}, для показа выбранным пользователям, Платформер будет использовать ссылку тестовой группы.',
    },
  },
});
</script>

<template>
  <i18n-t keypath="text">
    <template
      v-for="(platform, idx) in platforms"
      :key="platform"
    >
      {{ idx ? ',' : undefined }}
      <b>{{ platform }}</b>
    </template>
  </i18n-t>
</template>
