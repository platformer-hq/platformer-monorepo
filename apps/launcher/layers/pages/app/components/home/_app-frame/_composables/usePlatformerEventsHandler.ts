import { useEventListener } from '@vueuse/core';
import * as fp from 'fp-ts';

import type { CommonErrorObj, ErrorResponse } from '~comms/types';

export function usePlatformerEventsHandler(options: {
  iframe: MaybeRefOrGetter<HTMLIFrameElement | null>;
  iframeOrigin: MaybeRefOrGetter<string>;
}) {
  useEventListener(window, 'message', ({ data, source }) => {
    const wnd = toValue(options.iframe)?.contentWindow;
    if (!wnd || source !== wnd) {
      return;
    }
    const iframeOrigin = toValue(options.iframeOrigin);
    const parseResult = fp.function.pipe(
      parsePlatformerEvent(data),
      fp.either.matchW(
        e => ({ kind: 'error' as const, error: e }),
        d => ({ kind: 'data' as const, data: d }),
      ),
    );
    if (parseResult.kind === 'error') {
      const { error } = parseResult;
      let responseError: CommonErrorObj;
      switch (error.kind) {
        case 'params-malformed':
          responseError = {
            kind: 'params-malformed',
            issues: error.error.issues.map(issue => issue.message),
          };
          break;
        case 'request-id-missing':
          responseError = { kind: 'request-id-missing' };
          break;
        case 'unknown-method':
          responseError = { kind: 'unknown-method', methodName: error.name };
          break;
      }
      wnd.postMessage(
        JSON.stringify({
          fromPlatformer: true,
          requestId: error.kind === 'request-id-missing' ? undefined : error.requestId,
          error: responseError,
        } satisfies ErrorResponse<CommonErrorObj>),
        iframeOrigin,
      );
      return;
    }
    const { data: parseData } = parseResult;
    if (!parseData) {
      return;
    }
    switch (parseData.event) {
      case 'platformer:callAppFunction':
        wnd.postMessage(JSON.stringify({
          isPlatformer: true,
          requestId: parseData.requestId,
          result: {
            test: 123,
          },
        }), iframeOrigin);
        console.warn('responded');
        break;
    }
  });
}
