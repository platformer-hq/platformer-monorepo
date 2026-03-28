import { errorClass, errorClassWithData } from 'error-kid';

export class ApiError extends errorClassWithData<
  { code: string; message?: string | null },
  [code: string, message?: string | null]
>({
  name: 'ApiError',
  data: (code, message) => ({ code, message }),
  super: (code, message) => [`${code}${message ? `: ${message}` : ''}`],
}) {
}

export class FetchError extends errorClass<[cause: unknown]>({
  name: 'FetchError',
  super: cause => ['Fetch failed', { cause }],
}) {
}

export class InvalidDataTypeError extends errorClass<[cause: unknown]>({
  name: 'InvalidDataTypeError',
  super: cause => ['Invalid data type', { cause }],
}) {
}

export class InvalidResponseDataError extends errorClass<[data: unknown]>({
  name: 'InvalidResponseDataError',
  super: data => [`Invalid response data: ${JSON.stringify(data)}`],
}) {
}

export class InvalidResponseFormatError extends errorClass<[data: unknown]>({
  name: 'InvalidResponseFormatError',
  super: data => [`Invalid response format: ${JSON.stringify(data)}`],
}) {
}
