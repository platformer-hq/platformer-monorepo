export type ObservableListener<D> = (data: D) => void;
export type Observable<D> = {
  emit: (data: D) => void;
  sub: (listener: ObservableListener<D>) => VoidFunction;
};
