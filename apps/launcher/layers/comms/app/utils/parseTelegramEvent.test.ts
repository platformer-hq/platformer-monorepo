import { it, expect } from 'vitest';

import { parseTelegramEvent } from './parseTelegramEvent';

it('should return error if value doesn\'t match schema', () => {
  expect(parseTelegramEvent({})).toMatchObject({ left: expect.anything() });
  expect(parseTelegramEvent({ eventData: {} })).toMatchObject({ left: expect.anything() });
  expect(parseTelegramEvent({ eventType: 1 })).toMatchObject({ left: expect.anything() });
});

it('should return object if value matches schema', () => {
  expect(parseTelegramEvent({ eventType: 'web_app_request_theme', eventData: { b: 2 } })).toMatchObject({
    right: {
      eventType: 'web_app_request_theme',
      eventData: { b: 2 },
    },
  });
  expect(parseTelegramEvent('{"eventType":"web_app_request_viewport","eventData":{"a":1}}')).toMatchObject({
    right: {
      eventType: 'web_app_request_viewport',
      eventData: { a: 1 },
    },
  });
});
