import { it, describe, expect } from 'vitest';

import { parsePlatformerEvent } from './parsePlatformerEvent';
import type { MethodName } from '../types';

it('should return undefined if value is not an object', () => {
  expect(parsePlatformerEvent(null)).toMatchObject({ right: undefined });
  expect(parsePlatformerEvent('')).toMatchObject({ right: undefined });
  expect(parsePlatformerEvent(123)).toMatchObject({ right: undefined });
});

it('should return undefined if value contains "event" field missing "platformer:" prefix', () => {
  expect(parsePlatformerEvent({})).toMatchObject({ right: undefined });
  expect(parsePlatformerEvent({ event: 'platformer' })).toMatchObject({ right: undefined });
});

it('should return unknown-method error if passed method is unknown', () => {
  expect(parsePlatformerEvent({ event: 'platformer:getMoney', requestId: '1' })).toMatchObject({
    left: {
      kind: 'unknown-method',
      name: 'platformer:getMoney',
      requestId: '1',
    },
  });
});

it('should return request-id-missing error if request id is missing', () => {
  expect(parsePlatformerEvent({ event: 'platformer:setLocation' })).toMatchObject({
    left: { kind: 'request-id-missing' },
  });
});

describe('testing params malformed error', () => {
  describe.each([
    {
      name: 'platformer:callAppFunction',
      cases: [
        {
          title: 'params omitted',
          params: { name: 'getUsers' },
          issues: [{
            message: 'Invalid key: Expected "params" but received undefined',
          }],
        },
        {
          title: 'name omitted',
          params: { params: '' },
          issues: [{ message: 'Invalid key: Expected "name" but received undefined' }],
        },
        {
          title: 'name and params omitted',
          params: {},
          issues: [
            { message: 'Invalid key: Expected "name" but received undefined' },
            { message: 'Invalid key: Expected "params" but received undefined' },
          ],
        },
        {
          title: 'additional param',
          params: {
            name: 'getUsers',
            params: {},
            somethingElse: 'Wow',
          },
          issues: [{ message: 'Invalid key: Expected never but received "somethingElse"' }],
        },
      ],
    },
  ] as {
    name: MethodName;
    cases: {
      title: string;
      params: unknown;
      issues: { message: string }[];
    }[];
  }[])('$name', ({ name, cases }) => {
    it.each(cases)('$title', ({ params, issues }) => {
      expect(parsePlatformerEvent({ event: name, requestId: '1', params })).toMatchObject({
        left: {
          kind: 'params-malformed',
          error: expect.objectContaining({
            issues: issues.map(issue => expect.objectContaining(issue)),
          }),
          requestId: '1',
        },
      });
    });
  });
});

describe('testing correct data', () => {
  it.each([
    {
      name: 'platformer:callAppFunction',
      params: { name: 'getUsers', params: {} },
    },
  ])('$name', ({ name, params }) => {
    expect(parsePlatformerEvent({ event: name, requestId: '1', params })).toMatchObject({
      right: {
        event: name,
        requestId: '1',
        params,
      },
    });
  });
});
