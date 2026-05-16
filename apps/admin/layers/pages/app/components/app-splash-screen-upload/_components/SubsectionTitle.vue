<script setup lang="ts">
const platform = useTmaPlatform();

const { b } = bem('app-splash-screen-upload-page-subsection-title');
</script>

<template>
  <AutoTypography
    :class="b(platform.mapped)"
    color="subtitle-text"
    variant="subheadline1"
    weight="semibold"
  >
    <slot/>
  </AutoTypography>
</template>

<style lang="scss">
.app-splash-screen-upload-page-subsection-title {
  margin: 16px 0 8px;

  &--ios {
    padding-left: 16px;
  }

  &--android {
    padding-left: 20px;
  }
}
</style>
