<script setup lang="ts">

</script>

<template>
  <ViewBase :back="false">
    <ViewContent>
      <ul>
        <li>
          <NuxtLink :to="{name: PAGE_NAME_APPS}">
            Apps
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{name: PAGE_NAME_SETTINGS}">
            Settings
          </NuxtLink>
        </li>
      </ul>
    </ViewContent>
  </ViewBase>
</template>

<style scoped>

</style>
