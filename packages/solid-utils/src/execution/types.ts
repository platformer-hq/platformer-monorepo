/**
 * Tuple meaning, that function execution failed.
 */
export type ExecutionFailedTuple<T> = [ok: false, error: T];

/**
 * Tuple meaning, that function execution was successful.
 */
export type ExecutionSuccessTuple<T> = [ok: true, data: T];

/**
 * Some operation execution result similar to GoLang's execution results.
 */
export type ExecutionTuple<D, E> = ExecutionSuccessTuple<D> | ExecutionFailedTuple<E>;