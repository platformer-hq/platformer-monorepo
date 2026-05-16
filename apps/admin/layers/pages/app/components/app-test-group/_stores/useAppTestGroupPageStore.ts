import { useSessionStorage } from '@vueuse/core';
import * as v from 'valibot';

export interface AppTestGroupStoreStateUser {
  id: number;
  name: string;
}

export interface AppTestGroupStoreState {
  enabled: boolean;
  title: string;
  url: string;
  platformIds: number[];
  users: AppTestGroupStoreStateUser[];
}

export const useAppTestGroupPageStore = defineStore('app-test-group-page', () => {
  const defaultState = {
    enabled: false,
    title: '',
    url: '',
    platformIds: [],
    users: [],
  };
  const state = useSessionStorage<AppTestGroupStoreState>('app-test-group-page-state', defaultState, {
    serializer: {
      read(value) {
        return v.parse(
          v.pipe(
            v.string(),
            v.parseJson(),
            v.looseObject({
              enabled: v.boolean(),
              title: v.string(),
              url: v.string(),
              platformIds: v.array(v.number()),
              users: v.array(v.object({
                id: v.number(),
                name: v.string(),
              })),
            }),
          ),
          value,
        );
      },
      write: JSON.stringify,
    },
  });

  return {
    enabled: computed(() => state.value.enabled),
    setEnabled(value: boolean) {
      state.value.enabled = value;
    },
    title: computed(() => state.value.title),
    setTitle(value: string) {
      state.value.title = value;
    },
    url: computed(() => state.value.url),
    setUrl(value: string) {
      state.value.url = value;
    },
    platformIds: computed(() => state.value.platformIds),
    setPlatformIds(value: number[]) {
      state.value.platformIds = [...value];
    },
    users: computed(() => state.value.users),
    setUsers(value: AppTestGroupStoreStateUser[]) {
      state.value.users = [...value];
    },
    reset() {
      state.value = defaultState;
    },
  };
});
