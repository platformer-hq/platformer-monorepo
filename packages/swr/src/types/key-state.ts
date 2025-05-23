export interface KeyStatePending<D> {
  status: 'pending',
  data: Promise<D>;
}

export interface KeyStateSuccess<D> {
  status: 'success';
  data: D;
}

export interface KeyStateError<D, E> {
  status: 'error';
  error: E;
  latestData?: D;
}

export type KeyState<D, E = unknown> =
  | KeyStatePending<D>
  | KeyStateSuccess<D>
  | KeyStateError<D, E>;