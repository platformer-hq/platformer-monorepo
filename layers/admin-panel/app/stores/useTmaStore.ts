import {
  retrieveAndroidDeviceData,
  retrieveLaunchParamsFp,
  retrieveRawInitDataFp,
} from '@tma.js/sdk-vue';
import { useSessionStorage } from '@vueuse/core';
import { function as fn, either, option } from 'fp-ts';

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

export const useTmaStore = defineStore('tma', () => {
  const {
    initDataRaw,
    launchParams,
    user,
    startParam,
    androidDeviceData,
  } = fn.pipe(
    either.Do,
    either.bindW('androidDeviceData', () => {
      return either.tryCatch(retrieveAndroidDeviceData, e => e as Error);
    }),
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
    }, ({ launchParams, initDataRaw, androidDeviceData }) => {
      const { tgWebAppStartParam = '' } = launchParams;
      return {
        androidDeviceData,
        launchParams,
        initDataRaw,
        startParam: tgWebAppStartParam,
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
  const platform = computed(() => {
    // const { tgWebAppPlatform } = launchParams;
    const tgWebAppPlatform = 'ios';
    const mappedPlatform = ['ios', 'macos'].includes(tgWebAppPlatform) ? 'ios' : 'android';
    return {
      raw: tgWebAppPlatform,
      mapped: mappedPlatform,
      isMappedAndroid: mappedPlatform === 'android',
      isMappedIos: mappedPlatform === 'ios',
    };
  });

  return {
    androidDeviceData,
    initDataRaw,
    launchParams,
    startParam,
    platform,
    user,
  };
});
