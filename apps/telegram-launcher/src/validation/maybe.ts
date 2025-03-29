import { type BaseIssue, type BaseSchema, nullable, optional } from 'valibot';

export function maybe<S extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(schema: S) {
  return optional(nullable(schema));
}