/**
 * Creates a method meta data.
 */
type CreateMethod<TParams, TSuccessPayload = never, TErrorPayload = never> = {
  params: TParams;
  successPayload: TSuccessPayload;
  errorPayload: TErrorPayload;
};

/**
 * Method name.
 */
export type MethodName = keyof MethodsMap;

/**
 * Method parameters.
 */
export type MethodParams<M extends MethodName> = MethodsMap[M]['params'];

/**
 * An error that may occur calling any method.
 */
export type CommonErrorObj = (
  | { kind: 'unknown-method'; methodName: string }
  | { kind: 'request-id-missing' }
  | { kind: 'params-malformed'; issues: string[] }
);

export interface SpecificErrorObj<TErrorPayload> {
  kind: 'execution';
  error: TErrorPayload;
}

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

export interface ErrorResponse<TError> {
  fromPlatformer: true;
  requestId?: string;
  error: TError;
}

export type MethodErrorResponseEvent<TMethodName extends MethodName> = SpecificErrorObj<
  MethodsMap[TMethodName]['errorPayload']
>;
