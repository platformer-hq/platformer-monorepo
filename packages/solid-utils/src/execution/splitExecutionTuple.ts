import type { Accessor } from 'solid-js';

import type { ExecutionTuple } from './types.js';

interface SplitResultSignal<T> extends Accessor<T> {
  ok: Accessor<boolean>;
}

export type SplitExecutionTupleResult<D, E> = [SplitResultSignal<D>, SplitResultSignal<E>];

function createSignal<T, E>(
  $executionResult: Accessor<ExecutionTuple<T, E>>,
  extractSuccessful: true,
): SplitResultSignal<T>;

function createSignal<T, E>(
  $executionResult: Accessor<ExecutionTuple<T, E>>,
  extractSuccessful: false,
): SplitResultSignal<E>;

function createSignal<T, E>(
  $executionResult: Accessor<ExecutionTuple<T, E>>,
  extractSuccessful: boolean,
): SplitResultSignal<T | E> {
  return Object.assign(
    () => {
      const tuple = $executionResult();
      if (tuple[0] !== extractSuccessful) {
        throw new Error('Illegal data access. Data is not ready');
      }
      return tuple[1];
    },
    {
      ok: () => $executionResult()[0] === extractSuccessful,
    },
  );
}

/**
 * Splits a signal, containing the operation execution tuple into two signals, containing
 * data and error.
 * @param $executionResult - signal returning an execution result.
 */
export function splitExecutionTuple<D, E>(
  $executionResult: Accessor<ExecutionTuple<D, E>>,
): SplitExecutionTupleResult<D, E> {
  return [
    createSignal($executionResult, true),
    createSignal($executionResult, false),
  ];
}