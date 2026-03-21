<script setup lang="ts">
import { useQuery } from '@pinia/colada';
import { miniApp } from '@tma.js/sdk-vue';

const apiStore = useApiStore();

if (import.meta.client) {
  const { data: response } = useQuery({
    ...useAuthenticateQueryOptions(),
    staleTime: 0,
    retry(_, error) {
      return !ApiGraphQLResponseError.is(error) || !error.hasErrorWithCode('ERR_INIT_DATA_INVALID');
    },
  });

  watch(response, data => {
    if (data) {
      apiStore.setToken({ token: data.token, expiresAt: data.expiresAt });
    }
  }, { immediate: true });

  if (!isPageReload()) {
    await navigateTo({ name: PageNames.Main, replace: true });
  }
}
</script>

<template>
  <ClientOnly>
    <NavigationStateProvider>
      <AppInitializer v-slot="{transition}" @ready="miniApp.ready">
        <NuxtPage v-if="apiStore.token" :page-key="route => route.path" :transition="transition"/>
      </AppInitializer>
    </NavigationStateProvider>
  </ClientOnly>
</template>
