<script setup lang="ts">
defineProps<{ size: number }>();
</script>

<template>
  <span class="root">
    <svg class="icon" :width="size" :height="size">
      <circle
        cx="50%"
        cy="50%"
        r="50%"
        stroke-linecap="round"
        stroke="currentcolor"
      />
    </svg>
  </span>
</template>

<style scoped lang="scss">
@use "sass:map" as map;
@use "sass:list" as list;

.root {
  color: var(--tgui-loading-indicator-android-color, currentcolor);
  display: inline-block;
}

.icon {
  fill: transparent;
  overflow: visible;
  display: block;
  animation: 1.4s ease-in-out infinite stroke, 1.4s linear infinite spin;
  stroke-width: 9%;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes stroke {
  $settings: (
    "0%": (#{1, 500%}, 0),
    "50%": (#{250%, 500%}, -37.5%),
    "100%": (#{250%, 500%}, -312.5%),
  );

  @each $percentage in ("0%", "50%", "100%") {
    $stroke-settings: map.get($settings, $percentage);

    #{$percentage} {
      stroke: {
        dasharray: list.nth($stroke-settings, 1);
        dashoffset: list.nth($stroke-settings, 2);
      }
    }
  }
}
</style>