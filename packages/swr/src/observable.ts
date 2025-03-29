export type ObservableListener<D> = (data: D) => void;
export type Observable<D> = {
  emit: (data: D) => void,
  sub: (listener: ObservableListener<D>) => VoidFunction,
};

export function observable<D>(): Observable<D> {
  const listeners: ObservableListener<D>[] = [];
  return {
    emit(data) {
      listeners.forEach(l => {
        l(data);
      });
    },
    sub(listener) {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        index >= 0 && listeners.splice(index, 1);
      };
    },
  };
}