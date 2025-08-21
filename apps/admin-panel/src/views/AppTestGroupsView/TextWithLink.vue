<script setup lang="ts">
defineProps<{
  html: string;
}>();
const emit = defineEmits<{
  linkClick: [];
}>();

const onClick = (e: MouseEvent) => {
  e.target instanceof HTMLAnchorElement && emit('linkClick');
};
</script>

<template>
  <span
    class="root"
    @click="onClick"
    v-html="html"
  />
</template>

<style scoped lang="scss">
@use "@/vue-ui/styles/mixins";

.root {
  :deep(a) {
    color: var(--theme-accent-text-color);
    @include mixins.clickable;
  }
}
</style>
