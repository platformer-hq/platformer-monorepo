import { ClientError } from 'graphql-request';
import * as v from 'valibot';

export class ApiGraphQLResponseError extends ClientError {
  constructor(...args: ConstructorParameters<typeof ClientError>) {
    super(...args);
    this.name = 'ApiGraphQLResponseError';
    Object.setPrototypeOf(this, ApiGraphQLResponseError.prototype);
  }

  static is(value: unknown): value is ApiGraphQLResponseError {
    return value instanceof ApiGraphQLResponseError;
  }

  hasErrorWithCode(code: string): boolean {
    const schema = v.looseObject({
      errorData: v.looseObject({
        code: v.literal(code),
      }),
    });
    return this.response.errors?.some(err => v.is(schema, err.extensions)) || false;
  }
}
