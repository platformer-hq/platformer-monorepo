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

  isOfType(type: string): boolean {
    return v.is(v.looseObject({
      errorData: v.looseObject({
        code: v.literal(type),
      }),
    }), this.response.extensions);
  }
}
