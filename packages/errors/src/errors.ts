import { errorClassWithData } from 'error-kid';

export class TimeoutError extends errorClassWithData<{ timeout: number }, [timeout: number]>({
  name: 'TimeoutError',
  data: timeout => ({ timeout }),
  super: timeout => [`Timeout: ${timeout}ms`],
}) {
}
