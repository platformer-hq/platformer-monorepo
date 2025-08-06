import type {
  KeyLatestData,
  KeyStateDataPromise,
  KeyStateError,
  KeyStatePending,
  KeyStateRevalidating,
  KeyStateSuccess,
} from './types/key-state.js';

export function createKeyState<D, E>(
  status: 'pending',
  data: KeyStateDataPromise<D, E>,
  error?: undefined,
  latestData?: KeyLatestData<D> | undefined,
): KeyStatePending<D, E>;
export function createKeyState<D, E>(
  status: 'revalidating',
  data: KeyStateDataPromise<D, E>,
  error: undefined,
  latestData: KeyLatestData<D>,
): KeyStateRevalidating<D, E>;
export function createKeyState<D>(
  status: 'success',
  data: D,
  error: undefined,
  latestData: KeyLatestData<D>,
): KeyStateSuccess<D>;
export function createKeyState<D, E>(
  status: 'error',
  data: undefined,
  error: E,
  latestData?: KeyLatestData<D> | undefined,
): KeyStateError<D, E>;
export function createKeyState(
  status: any,
  data: any,
  error: any,
  latestData: any,
): any {
  return { status, data, latestData, error };
}
