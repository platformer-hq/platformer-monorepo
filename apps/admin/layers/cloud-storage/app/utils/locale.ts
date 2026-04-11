import { cloudStorage } from '@tma.js/sdk-vue';
import * as fp from 'fp-ts';
import * as v from 'valibot';

import type { KnownLocale } from '#i18n-layer/types';

const KEY_NAME = 'locale';

export function csSaveLocale(locale: KnownLocale) {
  return cloudStorage.setItemFp(KEY_NAME, locale);
}

export function csGetLocale() {
  return fp.function.pipe(
    cloudStorage.getItemFp(KEY_NAME),
    fp.taskEither.map(value => (
      v.is(v.union([v.literal('ru'), v.literal('en')]), value)
        ? value satisfies KnownLocale
        : undefined
    )),
  );
}
