import { ClientError } from 'graphql-request';
import * as v from 'valibot';

export class ApiGraphQLError extends ClientError {
  constructor(...args: ConstructorParameters<typeof ClientError>) {
    super(...args);
    this.name = 'ApiGraphQLError';
    Object.setPrototypeOf(this, ApiGraphQLError.prototype);
  }

  static is(value: unknown): value is ApiGraphQLError {
    return value instanceof ApiGraphQLError;
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
