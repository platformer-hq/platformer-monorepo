import { LaunchParamsSchema, parseLaunchParamsQuery } from '@mini-apps/telegram-transformers';
import {
  type DeepConvertSnakeKeysToCamelCase,
  deepSnakeToCamelObjKeys,
} from '@mini-apps/toolkit';
import type { InferOutput } from 'valibot';

import { retrieveRawLaunchParams } from '@/launch-params/retrieveRawLaunchParams.js';

export type RetrieveLPResult = InferOutput<typeof LaunchParamsSchema>;
export type RetrieveLPResultCamelCased =
  DeepConvertSnakeKeysToCamelCase<InferOutput<typeof LaunchParamsSchema>>;

/**
 * @returns Launch parameters from any known source.
 * @param camelCase - should the output be camel-cased.
 * @throws {LaunchParamsRetrieveError} Unable to retrieve launch parameters. They are probably
 * invalid.
 */
export function retrieveLaunchParams(camelCase?: false): RetrieveLPResult;

/**
 * @returns Launch parameters from any known source.
 * @param camelCase - should the output be camel-cased.
 * @throws {LaunchParamsRetrieveError} Unable to retrieve launch parameters. They are probably
 * invalid.
 */
export function retrieveLaunchParams(camelCase: true): RetrieveLPResultCamelCased;

/**
 * @returns Launch parameters from any known source.
 * @throws {LaunchParamsRetrieveError} Unable to retrieve launch parameters. They are probably
 * invalid.
 */
export function retrieveLaunchParams(camelCase?: boolean):
  | RetrieveLPResult
  | RetrieveLPResultCamelCased {
  const launchParams = parseLaunchParamsQuery(retrieveRawLaunchParams());
  return camelCase ? deepSnakeToCamelObjKeys(launchParams) : launchParams;
}
