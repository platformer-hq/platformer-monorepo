/**
 * Creates a method meta data.
 */
type CreateMethod<TParams, TSuccessPayload = never, TErrorPayload = never> = {
  params: TParams;
  successPayload: TSuccessPayload;
  errorPayload: TErrorPayload;
};

/**
 * Prefixed method name.
 */
export type MethodName = keyof MethodsMap;

/**
 * Prefixed method parameters.
 */
export type MethodParams<M extends MethodName> = MethodsMap[M]['params'];

/**
 * Unprefixed method name.
 */
export type UnprefixedMethodName = MethodName extends `platformer:${infer U}` ? U : never;

/**
 * Unprefixed method parameters.
 */
export type UnprefixedMethodParams<M extends UnprefixedMethodName> = MethodsMap[`platformer:${M}`]['params'];

/**
 * An error that may occur calling any method.
 */
export type CommonErrorObj = (
  | { error: 'unknown-method'; name: string }
  | { error: 'request-id-missing' }
  | { error: 'params-malformed'; message: string }
);

export interface MethodsMap {
  /**
   * Calls the current mini app function.
   */
  'platformer:callAppFunction': CreateMethod<{
    /**
     * Function name.
     */
    name: string;
    /**
     * Parameters to pass to the function.
     */
    params: unknown;
  }, {
    /**
     * Function execution result.
     */
    result: unknown;
  }, {
    /**
     * Occurred error message.
     */
    error: string;
  }>;
}
