import * as fp from 'fp-ts';
import * as v from 'valibot';

import type { MethodName, MethodParams, MethodsMap } from '../types';

type AnyEvent = {
  [TEventName in keyof MethodsMap]: {
    event: TEventName;
    requestId: string;
    params: MethodParams<TEventName>;
  }
}[keyof MethodsMap];

const eventSchema = v.variant('event', [
  v.looseObject({
    event: v.literal('platformer:callAppFunction'),
    requestId: v.string(),
    params: v.strictObject({
      name: v.string(),
      params: v.unknown(),
    }),
  }),
]) satisfies v.BaseSchema<unknown, AnyEvent, v.BaseIssue<unknown>>;

/**
 * Parses incoming data as a Platformer event.
 * @param data - data to parse.
 * @returns Either an error or parsed event data.
 */
export function parsePlatformerEvent(data: unknown): fp.either.Either<(
  | { kind: 'unknown-method'; name: string; requestId: string }
  | { kind: 'params-malformed'; error: v.ValiError<typeof eventSchema>; requestId: string }
  | { kind: 'request-id-missing' }
), AnyEvent | undefined> {
  const dataObjParseResult = v.safeParse(
    v.pipe(
      v.union([
        v.pipe(v.string(), v.parseJson()),
        v.looseObject({}),
      ]),
      v.looseObject({
        event: v.pipe(v.string(), v.startsWith('platformer:')),
      }),
    ),
    data,
  );
  if (!dataObjParseResult.success) {
    return fp.either.right(undefined);
  }
  const dataObj = dataObjParseResult.output;
  const knownEventParseResult = v.safeParse(eventSchema, dataObj);
  if (knownEventParseResult.success) {
    return fp.either.right(knownEventParseResult.output);
  }
  if (!v.is(v.looseObject({ requestId: v.string() }), dataObj)) {
    return fp.either.left({ kind: 'request-id-missing' });
  }
  const knownEvents: Record<MethodName, 1> = {
    'platformer:callAppFunction': 1,
  };
  if (!(dataObj.event in knownEvents)) {
    return fp.either.left({
      kind: 'unknown-method',
      name: dataObj.event,
      requestId: dataObj.requestId,
    });
  }
  return fp.either.left({
    kind: 'params-malformed',
    error: new v.ValiError(knownEventParseResult.issues),
    requestId: dataObj.requestId,
  });
}
