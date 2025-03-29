import { string, looseObject, pipe, date, transform } from 'valibot';

export const AuthToken = looseObject({
  token: string(),
  expiresAt: pipe(
    string(),
    transform((v) => new Date(v)),
    date(),
  ),
});