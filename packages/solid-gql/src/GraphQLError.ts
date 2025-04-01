import { GraphQLError as _GraphQLError } from '@solid-primitives/graphql';
import { looseObject, is, literal } from 'valibot';

export class GraphQLError extends _GraphQLError {
  static is(value: unknown): value is GraphQLError {
    return value instanceof GraphQLError;
  }

  isOfType(type: string): boolean {
    return is(looseObject({
      errorData: looseObject({
        code: literal(type),
      }),
    }), this.extensions);
  }
}
