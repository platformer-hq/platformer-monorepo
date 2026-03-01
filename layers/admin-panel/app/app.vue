<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { miniApp } from '@tma.js/sdk-vue';

const apiStore = useApiStore();

if (import.meta.client) {
  const { data: response } = useQuery({
    ...useAuthenticateQueryOptions(),
    staleTime: 0,
    retry(_, error) {
      return !ApiGraphQLError.is(error) || !error.isOfType('ERR_INIT_DATA_INVALID');
    },
  });

  watch(response, data => {
    if (data) {
      apiStore.setToken({ token: data.token, expiresAt: data.expiresAt });
    }
  }, { immediate: true });

  if (!isPageReload()) {
    await navigateTo({ name: PAGE_NAME_MAIN, replace: true });
  }
}
</script>

<template>
  <ClientOnly>
    <NavigationStateProvider>
      <LayoutBody v-slot="{transition}" @ready="miniApp.ready">
        <NuxtPage v-if="apiStore.token" :page-key="route => route.path" :transition="transition"/>
      </LayoutBody>
    </NavigationStateProvider>
  </ClientOnly>
</template>
