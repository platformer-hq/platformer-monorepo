import { errorClass, errorClassWithData } from 'error-kid';

export const [ApiError, isApiError] = errorClassWithData<
  { code: string; message?: string | null },
  [code: string, message?: string | null]
>(
  'ApiError',
  (code, message) => ({ code, message }),
  (code, message) => [`${code}${message ? `: ${message}` : ''}]`],
);

export const [
  FetchError,
  isFetchError,
] = errorClass<[cause: unknown]>('FetchError', cause => ['Fetch failed', { cause }]);

export const [
  InvalidDataTypeError,
  isInvalidDataTypeError,
] = errorClass<[cause: unknown]>('InvalidDataTypeError', cause => ['Invalid data type', { cause }]);

export const [
  InvalidResponseDataError,
  isInvalidResponseDataError,
] = errorClass<[data: unknown]>('InvalidResponseDataError', data => [`Invalid response data: ${JSON.stringify(data)}`]);

export const [
  InvalidResponseFormatError,
  isInvalidResponseFormatError,
] = errorClass<[data: unknown]>('InvalidResponseFormatError', data => [`Invalid response format: ${JSON.stringify(data)}`]);
