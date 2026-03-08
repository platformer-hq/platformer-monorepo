import { cloudStorage } from '@tma.js/sdk-vue';
import { function as fn, taskEither } from 'fp-ts';
import * as v from 'valibot';

import type { KnownLocale } from '~/domains/i18n/types';

const KEY_NAME = 'locale';

export function csSaveLocale(locale: KnownLocale) {
  return cloudStorage.setItemFp(KEY_NAME, locale);
}

export function csGetLocale() {
  return fn.pipe(
    cloudStorage.getItemFp(KEY_NAME),
    taskEither.map(value => (
      v.is(v.union([v.literal('ru'), v.literal('en')]), value)
        ? value satisfies KnownLocale
        : undefined
    )),
  );
}
