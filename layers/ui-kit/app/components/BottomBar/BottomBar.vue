<script setup lang="ts">
const { b, e } = bem('bottom-bar');

const rootRef = useTemplateRef('root');
defineExpose({
  element: computed(() => rootRef.value?.element),
});
</script>

<template>
  <SafeAreaInsets ref="root" :class="b()" left right bottom>
    <div :class="e('inner')">
      <slot/>
    </div>
  </SafeAreaInsets>
</template>

<style lang="scss">
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  &__inner {
    padding: 0 16px 16px;
  }
}
</style>
