<script setup lang="ts">
const rootRef = useTemplateRef('root');
const rootEl = computed(() => rootRef.value?.element);

defineExpose({ element: rootEl });
</script>

<template>
  <SafeAreaInsets ref="root" class="tgui-bottom-bar" left right bottom>
    <slot/>
  </SafeAreaInsets>
</template>

<style lang="scss">
.tgui-bottom-bar {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  transition: 300ms ease-out;
}
</style>
