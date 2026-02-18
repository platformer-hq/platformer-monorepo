import {
  retrieveLaunchParamsFp,
  retrieveRawInitDataFp,
  type LaunchParams,
  type Platform,
} from '@tma.js/sdk-vue';
import { useSessionStorage } from '@vueuse/core';
import { function as fn, either, option } from 'fp-ts';

import type { KnownPlatform } from '../domains/platform/types';

interface User {
  id: number;
  firstName: string;
  allowsWriteToPm?: boolean;
  isPremium?: boolean;
  languageCode?: string;
  lastName?: string;
  photoUrl?: string;
  username?: string;
}

interface Value {
  user: Ref<User | undefined>;
  launchParams: LaunchParams;
  startParam: string;
  initDataRaw: string;
  platform: {
    raw: Platform;
    mapped: KnownPlatform;
    isMappedAndroid: boolean;
    isMappedIos: boolean;
  };
}

export const useTmaStore = defineStore('tma', () => {
  const {
    initDataRaw,
    launchParams,
    platform,
    user,
    startParam,
  } = fn.pipe(
    either.Do,
    either.bindW('launchParams', retrieveLaunchParamsFp),
    either.bindW('initDataRaw', () => {
      return fn.pipe(
        retrieveRawInitDataFp(),
        either.map(initDataOption => {
          return fn.pipe(
            initDataOption,
            option.match(() => '', v => v),
          );
        }),
      );
    }),
    either.matchW(e => {
      throw e;
    }, ({ launchParams, initDataRaw }): Value => {
      const {
        tgWebAppStartParam = '',
        // tgWebAppPlatform,
      } = launchParams;
      const tgWebAppPlatform = 'ios';
      const mappedPlatform = ['ios', 'macos'].includes(tgWebAppPlatform) ? 'ios' : 'android';
      return {
        launchParams,
        initDataRaw,
        startParam: tgWebAppStartParam,
        platform: {
          raw: tgWebAppPlatform,
          mapped: mappedPlatform,
          isMappedAndroid: mappedPlatform === 'android',
          isMappedIos: mappedPlatform === 'ios',
        },
        user: useSessionStorage<User | undefined>(
          'tma-user',
          () => {
            const user = launchParams.tgWebAppData?.user;
            return user
              ? {
                firstName: user.first_name,
                id: user.id,
                allowsWriteToPm: user.allows_write_to_pm,
                isPremium: user.is_premium,
                languageCode: user.language_code,
                lastName: user.last_name,
                photoUrl: user.photo_url,
                username: user.username,
              }
              : undefined;
          },
          {
            serializer: {
              read: v => JSON.parse(v) as User,
              write: JSON.stringify,
            },
          },
        ),
      };
    }),
  );

  return {
    initDataRaw,
    launchParams,
    startParam,
    platform,
    user,
  };
});
