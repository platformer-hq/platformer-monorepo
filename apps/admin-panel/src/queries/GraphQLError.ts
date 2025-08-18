import { ClientError } from 'graphql-request';
import { is, literal, looseObject } from 'valibot';

export class GraphQLError extends ClientError {
  constructor(...args: ConstructorParameters<typeof ClientError>) {
    super(...args);
    this.name = 'GraphQLError';
  }

  static is(value: unknown): value is GraphQLError {
    return value instanceof GraphQLError;
  }

  isOfType(type: string): boolean {
    return is(looseObject({
      errorData: looseObject({
        code: literal(type),
      }),
    }), this.response.extensions);
  }
}
