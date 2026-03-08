import {
  retrieveAndroidDeviceData,
  retrieveLaunchParamsFp,
  retrieveRawInitDataFp,
} from '@tma.js/sdk-vue';
import { useSessionStorage } from '@vueuse/core';
import * as fp from 'fp-ts';
import * as v from 'valibot';

export const useTmaStore = defineStore('tma', () => {
  const { initDataRaw, launchParams } = fp.function.pipe(
    fp.either.Do,
    fp.either.bindW('launchParams', retrieveLaunchParamsFp),
    fp.either.bindW('initDataRaw', () => {
      return fp.function.pipe(
        retrieveRawInitDataFp(),
        fp.either.map(initDataOption => {
          return fp.function.pipe(initDataOption, fp.option.match(() => '', v => v));
        }),
      );
    }),
    fp.either.matchW(e => {
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
          return v.parse(
            v.pipe(
              v.string(),
              v.parseJson(),
              v.looseObject({
                firstName: v.string(),
                id: v.number(),
                allowsWriteToPm: v.optional(v.boolean()),
                isPremium: v.optional(v.boolean()),
                languageCode: v.optional(v.string()),
                lastName: v.optional(v.string()),
                photoUrl: v.optional(v.string()),
                username: v.optional(v.string()),
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
