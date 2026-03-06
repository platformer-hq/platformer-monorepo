import {
  retrieveAndroidDeviceData,
  retrieveLaunchParamsFp,
  retrieveRawInitDataFp,
} from '@tma.js/sdk-vue';
import { useSessionStorage } from '@vueuse/core';
import { function as fn, either, option } from 'fp-ts';
import { boolean, looseObject, number, optional, parse, parseJson, pipe, string } from 'valibot';

export const useTmaStore = defineStore('tma', () => {
  const { initDataRaw, launchParams } = fn.pipe(
    either.Do,
    either.bindW('launchParams', retrieveLaunchParamsFp),
    either.bindW('initDataRaw', () => {
      return fn.pipe(
        retrieveRawInitDataFp(),
        either.map(initDataOption => {
          return fn.pipe(initDataOption, option.match(() => '', v => v));
        }),
      );
    }),
    either.matchW(e => {
      throw e;
    }, v => v),
  );
  const user = useSessionStorage(
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
        read(value) {
          return parse(
            pipe(
              string(),
              parseJson(),
              looseObject({
                firstName: string(),
                id: number(),
                allowsWriteToPm: optional(boolean()),
                isPremium: optional(boolean()),
                languageCode: optional(string()),
                lastName: optional(string()),
                photoUrl: optional(string()),
                username: optional(string()),
              }),
            ),
            value,
          );
        },
        write: JSON.stringify,
      },
    },
  );
  const platform = computed(() => {
    const { tgWebAppPlatform } = launchParams;
    // const tgWebAppPlatform = 'ios';
    const mappedPlatform = ['ios', 'macos'].includes(tgWebAppPlatform) ? 'ios' : 'android';
    return {
      raw: tgWebAppPlatform,
      mapped: mappedPlatform,
      isMappedAndroid: mappedPlatform === 'android',
      isMappedIos: mappedPlatform === 'ios',
    };
  });

  return {
    androidDeviceData: retrieveAndroidDeviceData(),
    initDataRaw,
    launchParams,
    platform,
    startParam: launchParams.tgWebAppStartParam || '',
    user,
  };
});
