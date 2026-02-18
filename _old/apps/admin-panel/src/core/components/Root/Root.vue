<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { postEvent } from '@telegram-apps/sdk-vue';
import { useSessionStorage } from '@vueuse/core';
import { watchEffect } from 'vue';

import { provideAppVersion } from '@/providers/appVersion.js';
import { providePlatform } from '@/providers/platform.js';
import { GraphQLError } from '@/queries/GraphQLError.js';
import { provideGqlOptions } from '@/queries/provider.js';
import { useGqlRequest } from '@/queries/useGqlRequest.js';

import { Authenticate } from './operations.js';

const { appVersion, endpoint, initData, platform } = defineProps<{
  appVersion: string;
  initData: string;
  endpoint: string;
  platform: 'ios' | 'android';
}>();
const token = useSessionStorage<{ token: string; expiresAt: Date }>('@platformer/auth-token', null, {
  serializer: {
    read: value => JSON.parse(value),
    write: value => JSON.stringify(value),
  },
});

provideAppVersion(appVersion);
provideGqlOptions({
  endpoint: new URL(endpoint, window.location.href).toString(),
  authToken: () => token.value?.token,
});
providePlatform(platform);

const request = useGqlRequest();
const { data } = useQuery({
  queryKey: ['authentication', initData],
  queryFn({ signal, queryKey: [, initData] }) {
    return request(Authenticate, { initData }, signal);
  },
  staleTime: 0,
  retry(_, error) {
    return !GraphQLError.is(error) || !error.isOfType('ERR_INIT_DATA_INVALID');
  },
});

watchEffect(() => {
  const response = data.value?.authenticateTelegram;
  if (response) {
    token.value = { token: response.token, expiresAt: new Date(response.expiresAt) };
  }
});
</script>

<template>
  <RouterView
    v-if="token"
    @vue:mounted="postEvent('web_app_ready')"
  />
</template>
