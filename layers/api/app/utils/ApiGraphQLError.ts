import { ClientError } from 'graphql-request';
import { is, literal, looseObject } from 'valibot';

export class ApiGraphQLError extends ClientError {
  constructor(...args: ConstructorParameters<typeof ClientError>) {
    super(...args);
    this.name = 'GraphQLError';
  }

  static is(value: unknown): value is ApiGraphQLError {
    return value instanceof ApiGraphQLError;
  }

  isOfType(type: string): boolean {
    return is(looseObject({
      errorData: looseObject({
        code: literal(type),
      }),
    }), this.response.extensions);
  }
}
