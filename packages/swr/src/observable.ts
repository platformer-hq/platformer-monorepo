import type { Observable, ObservableListener } from './types/index.js';

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
