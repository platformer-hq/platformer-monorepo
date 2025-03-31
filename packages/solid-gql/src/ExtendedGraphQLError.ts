import { GraphQLError } from '@solid-primitives/graphql';
import { looseObject, is, literal } from 'valibot';

export class ExtendedGraphQLError extends GraphQLError {
  static is(value: unknown): value is ExtendedGraphQLError {
    return value instanceof ExtendedGraphQLError;
  }

  isOfType(type: string): boolean {
    return is(looseObject({
      errorData: looseObject({
        code: literal(type),
      }),
    }), this.extensions);
  }
}
