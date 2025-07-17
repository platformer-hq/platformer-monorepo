import { ClientError } from 'graphql-request';
import { looseObject, is, literal } from 'valibot';

export class GraphQLError extends ClientError {
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
