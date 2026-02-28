import { useSessionStorage } from '@vueuse/core';
import { GraphQLClient } from 'graphql-request';
import { date, looseObject, parse, parseJson, pipe, string, transform } from 'valibot';

export const useApiStore = defineStore('api', () => {
  const baseUrl = new URL(
    useRuntimeConfig().public.apiBaseUrl,
    import.meta.client
      ? window.location.origin
      : 'a://a',
  ).toString();
  const token = useSessionStorage<{ token: string; expiresAt: Date } | null>('@platformer/auth-token', null, {
    serializer: {
      read(value) {
        return parse(
          pipe(
            string(),
            parseJson(),
            looseObject({
              token: string(),
              expiresAt: pipe(string(), transform(v => new Date(v)), date()),
            }),
          ),
          value,
        );
      },
      write(value) {
        return value
          ? JSON.stringify({
            token: value.token,
            expiresAt: value.expiresAt.toISOString(),
          })
          : '';
      },
    },
  });

  return {
    token,
    setToken(value: { token: string; expiresAt: Date }) {
      token.value = value;
    },
    client: computed(() => {
      return new GraphQLClient(baseUrl, {
        headers: token.value
          ? { Authorization: `jwt ${token.value.token}` }
          : {},
      });
    }),
  };
});
