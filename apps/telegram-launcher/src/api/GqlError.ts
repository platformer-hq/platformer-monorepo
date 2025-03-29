import { errorClassWithData } from 'error-kid';

export const [GqlError] = errorClassWithData<{
  code: string;
  message?: Maybe<string>;
}, [code: string, message?: Maybe<string>]>(
  'GqlError',
  (code, message) => ({ code, message }),
  (_code, message) => [message || ''],
);