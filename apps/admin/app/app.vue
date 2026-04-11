<script setup lang="ts">
import { miniApp } from '@tma.js/sdk-vue';
import { ApiGraphQLResponseError } from '@workspace/api';

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
      miniApp.ready();
    }
  }, { immediate: true });

  if (!isPageReload()) {
    await navigateTo({ name: PageNames.Main, replace: true });
  }
}
</script>

<template>
  <Head>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=no"
    >
  </Head>
  <ClientOnly>
    <NavigationStateProvider>
      <AppInitializer v-slot="{transition}">
        <NuxtPage v-if="apiStore.token" :page-key="route => route.path" :transition="transition"/>
      </AppInitializer>
    </NavigationStateProvider>
  </ClientOnly>
</template>
