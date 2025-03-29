import { string, pipe, transform, minValue, integer } from 'valibot';

export function positiveIntFromStr() {
  return pipe(string(), transform(Number), integer(), minValue(1))
}
