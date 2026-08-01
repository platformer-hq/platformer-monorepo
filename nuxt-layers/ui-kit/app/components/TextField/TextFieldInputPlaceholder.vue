<script lang="ts" setup>
import VTypography, {
  type TypographyVariant,
  type TypographyWeight,
} from '~/components/VTypography/VTypography.vue';

defineProps<{
  fontVariant?: TypographyVariant;
  fontWeight?: TypographyWeight;
}>();
</script>

<template>
  <VTypography class="text-field-input-placeholder" :variant="fontVariant" :weight="fontWeight">
    <slot/>
  </VTypography>
</template>

<style>
.text-field-input-placeholder {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 0;
  pointer-events: none;
  color: var(--subtitle-text-color);
}
</style>
