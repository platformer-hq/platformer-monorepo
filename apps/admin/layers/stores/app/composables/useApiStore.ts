import { useSessionStorage } from '@vueuse/core';
import { GraphQLClient } from 'graphql-request';
import * as v from 'valibot';

export const useApiStore = defineStore('api', () => {
  const baseUrl = new URL(
    import.meta.env.DEV ? '/api/gql' : 'https://mini-apps.store/api/gql',
    import.meta.client
      ? window.location.origin
      : 'a://a',
  ).toString();
  const token = useSessionStorage<{ token: string; expiresAt: Date } | null>('@platformer/auth-token', null, {
    serializer: {
      read(value) {
        return v.parse(
          v.pipe(
            v.string(),
            v.parseJson(),
            v.looseObject({
              token: v.string(),
              expiresAt: v.pipe(v.string(), v.transform(v => new Date(v)), v.date()),
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
