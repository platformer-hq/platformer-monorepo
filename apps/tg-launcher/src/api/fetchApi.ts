import { type BaseSchema, type InferOutput, is, literal, looseObject, nullish, string, unknown } from 'valibot';

import {
  ApiError,
  FetchError,
  InvalidDataTypeError,
  InvalidResponseDataError,
  InvalidResponseFormatError,
} from './errors.js';

/**
 * Performs a REST request to the Platformer API.
 * @param url - url to send request to.
 * @param schema - schema to validate the response data against.
 * @param options - optional request options.
 * @returns Response data.
 */
export async function fetchApi<S extends BaseSchema<any, any, any>>(
  url: string | URL,
  schema: S,
  options?: RequestInit,
): Promise<InferOutput<S>> {
  let response: Response;
  try {
    response = await fetch(url, options);
  } catch (e) {
    throw new FetchError(e);
  }
  let json: unknown;
  try {
    json = await response.json();
  } catch (e) {
    throw new InvalidDataTypeError(e);
  }

  if (is(
    looseObject({
      ok: literal(false),
      error: looseObject({ code: string(), message: nullish(string()) }),
    }),
    json,
  )) {
    throw new ApiError(json.error.code, json.error.message);
  }

  if (is(looseObject({ ok: literal(true), data: unknown() }), json)) {
    if (is(schema, json.data)) {
      return json.data;
    }
    throw new InvalidResponseDataError(json.data);
  }

  throw new InvalidResponseFormatError(json);
}
