import type { Accessor } from 'solid-js';

import type { ExecutionTuple } from './types.js';

interface SplitResultSignal<T> extends Accessor<T> {
  ok: Accessor<boolean>;
}

function createSignal<T, E>(
  result: Accessor<ExecutionTuple<T, E>>,
  statusFlag: true,
): SplitResultSignal<T>;

function createSignal<T, E>(
  result: Accessor<ExecutionTuple<T, E>>,
  statusFlag: false,
): SplitResultSignal<E>;

function createSignal<T, E>(
  result: Accessor<ExecutionTuple<T, E>>,
  statusFlag: boolean,
): SplitResultSignal<T | E> {
  return Object.assign(
    () => {
      const tuple = result();
      if (tuple[0] !== statusFlag) {
        throw new Error('Illegal data access. Data is not ready');
      }
      return tuple[1];
    },
    { ok: () => result()[0] === statusFlag },
  );
}

/**
 * Splits a signal, containing the operation execution tuple into two signals, containing
 * data and error.
 * @param result - signal returning an execution result.
 */
export function splitExecutionTuple<T, E>(
  result: Accessor<ExecutionTuple<T, E>>,
): [SplitResultSignal<T>, SplitResultSignal<E>] {
  return [createSignal(result, true), createSignal(result, false)];
}