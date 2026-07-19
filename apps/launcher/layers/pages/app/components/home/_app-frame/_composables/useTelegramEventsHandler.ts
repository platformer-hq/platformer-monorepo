import {
  miniApp, postEvent, type KnownThemeParamsKey, type MethodName, type RGB,
} from '@tma.js/sdk-vue';
import { useEventListener } from '@vueuse/core';
import * as fp from 'fp-ts';
import * as v from 'valibot';

type AnyColor = KnownThemeParamsKey | RGB | string;

export function useTelegramEventsHandler(options: {
  iframe: MaybeRefOrGetter<HTMLIFrameElement | null>;
  iframeOrigin: MaybeRefOrGetter<string>;
  initialColors: MaybeRefOrGetter<{
    header: AnyColor;
    background: AnyColor;
    bottomBar: AnyColor;
  }>;
  onReady(): void;
}) {
  // List of collected mini apps events that were stopped while the launcher was waiting
// for the application to load. We will then run them when the app is ready.
  const pausedRequests: { eventType: string; eventData: unknown }[] = [];
  let isContainerReady = false;

  const handleContainerLoadingEvent = (eventType: string, eventData: unknown) => {
    // Whenever the mini app notifies about it being ready to be shown, we should call all
    // paused requests that we collected previously.
    if (eventType === 'web_app_ready') {
      console.log('The app is ready. Going to call previously collected events');
      isContainerReady = true;

      const initialColors = toValue(options.initialColors);
      const requestNames = new Set(pausedRequests.map(r => r.eventType));
      const uiColors = [
        { component: 'header' as const, color: initialColors.header },
        { component: 'background' as const, color: initialColors.background },
        { component: 'bottomBar' as const, color: initialColors.bottomBar },
      ].filter(({ component }) => {
        if (component === 'header') {
          return !requestNames.has('web_app_set_header_color');
        }
        if (component === 'background') {
          return !requestNames.has('web_app_set_background_color');
        }
        return !requestNames.has('web_app_set_bottom_bar_color');
      });
      // Run all paused requests.
      pausedRequests.forEach(request => {
        // FIXME: use miniApp on web_app_set_header_color...
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (postEvent as any)(request.eventType, request.eventData);
      });
      // Run UI related requests.
      uiColors.forEach(({ component, color }) => {
        try {
          console.log('Restoring UI color', { component, color });
          if (component === 'header') {
            miniApp.setHeaderColor.ifAvailable(color);
            return;
          }
          if (component === 'background') {
            miniApp.setBgColor.ifAvailable(color);
            return;
          }
          // This method may fail in Web version of Telegram.
          miniApp.setBottomBarColor.ifAvailable(color);
        } catch (e) {
          console.warn('Failed to restore UI color', component, color, e);
        }
      });
      options.onReady();
      return;
    }

    // List of methods specified in this list is considered safe and non UI-mutating. Due to
    // this reason we are allowing to use them even if the app is not ready to be displayed yet.
    if (
      ([
        'iframe_ready',
        'iframe_will_reload',
        'web_app_invoke_custom_method',
        'web_app_request_content_safe_area',
        'web_app_request_safe_area',
        'web_app_request_theme',
        'web_app_request_viewport',
      ] satisfies MethodName[] as string[]).includes(eventType)
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (postEvent as any)(eventType, eventData);
    }

    console.log('Delaying call until the app is ready:', { eventType, eventData });
    pausedRequests.push({ eventType, eventData });
  };

  const handleContainerReadyEvent = (eventType: string, eventData: unknown) => {
    // Intercept UI mutations, so after the page reload, we could restore them.
    if (eventType === 'web_app_set_header_color') {
      if (
        v.is(
          v.union([
            v.object({ color: v.string() }),
            v.object({ color_key: v.union([v.literal('bg_color'), v.literal('secondary_bg_color')]) }),
          ]),
          eventData,
        )
      ) {
        return miniApp.setHeaderColor.ifAvailable(
          'color' in eventData ? eventData.color : eventData.color_key,
        );
      }
    }
    if (['web_app_set_background_color', 'web_app_set_bottom_bar_color'].includes(eventType)) {
      if (v.is(v.object({ color: v.string() }), eventData)) {
        return miniApp[
          eventType === 'web_app_set_background_color' ? 'setBgColor' : 'setBottomBarColor'
        ].ifAvailable(eventData.color);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (postEvent as any)(eventType, eventData);
  };

  useEventListener(window, 'message', ({ data, source }) => {
    const wnd = toValue(options.iframe)?.contentWindow;
    if (!wnd) {
      return;
    }
    if (source !== wnd) {
      // The event was sent from the Telegram application. Pass it to the wrapped mini app.
      return wnd.postMessage(data, toValue(options.iframeOrigin));
    }
    fp.function.pipe(
      parseTelegramEvent(data),
      fp.either.map(({ eventType, eventData }) => {
        if (isContainerReady) {
          handleContainerReadyEvent(eventType, eventData);
        } else {
          handleContainerLoadingEvent(eventType, eventData);
        }
      }),
    );
  });
}
