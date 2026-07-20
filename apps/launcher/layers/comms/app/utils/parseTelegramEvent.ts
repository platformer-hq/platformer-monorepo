import * as fp from 'fp-ts';
import * as v from 'valibot';
import { ValiError } from 'valibot';

/**
 * Parses incoming postMessage data as Telegram Mini Apps event.
 * @param data
 */
export function parseTelegramEvent(data: unknown) {
  const result = v.safeParse(
    v.pipe(
      v.union([
        v.pipe(v.string(), v.parseJson()),
        v.looseObject({}),
      ]),
      v.looseObject({
        eventType: v.string(),
        eventData: v.optional(v.unknown()),
      }),
    ),
    data,
  );
  return result.success
    ? fp.either.right(result.output)
    : fp.either.left(new ValiError(result.issues));
}
