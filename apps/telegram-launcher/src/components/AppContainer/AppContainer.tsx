import { onCleanup, onMount } from 'solid-js';
import { isRGB, MethodName, postEvent } from '@telegram-apps/sdk-solid';
import { looseObject, optional, parse, string, unknown } from 'valibot';
import { createEventListener } from 'solid-utils';

import { useMainContext } from '@/providers/MainProvider.js';
import type { InitialColorsTuple } from '@/types/common.js';

import './AppContainer.scss';

/**
 * Container displaying and configuring wrapped mini application.
 */
export function AppContainer(props: {
  /**
   * Timeout in milliseconds determining how much time the wrapped mini application has
   * to load.
   */
  loadTimeout: number;
  /**
   * Will be called whenever the iframe failed to load.
   */
  onError: () => void;
  /**
   * Will be called whenever the application notified about being ready.
   */
  onReady: () => void;
  /**
   * Will be called whenever the application failed to load due to timeout.
   */
  onTimeout: () => void;
  /**
   * URL of the mini application to open.
   */
  url: string;
}) {
  const { initialColors, logger: { log, group, groupEnd } } = useMainContext();

  // List of collected Mini Apps events along with their parameters, which are related to the
  // UI updates.
  const collectedUIEvents: [string, unknown][] = [];
  let isContainerReady = false;
  let iframe!: HTMLIFrameElement;

  // Give some time for the mini application to load.
  // When the timeout is reached, notify the parent component about it.
  const timeoutID = setTimeout(props.onTimeout, props.loadTimeout);
  onCleanup(() => {
    clearTimeout(timeoutID);
  });

  onMount(() => {
    const { contentWindow } = iframe;
    if (!contentWindow) {
      console.error('contentWindow is missing');
      return;
    }

    // Define iframe listeners to proxy all methods' calls to the Telegram client.
    // Also, do the same to proxy events from the Telegram client to the mini application.
    const onMessage = ({ data, source }: MessageEvent) => {
      let payload: { eventType: string; eventData?: any } | undefined;
      try {
        payload = parse(looseObject({
          eventType: string(),
          eventData: optional(unknown()),
        }), JSON.parse(data));
      } catch {
        return;
      }
      if (source !== contentWindow) {
        // The event was sent from the Telegram application. Pass it to the wrapped mini app.
        // TODO: Set target origin?
        return contentWindow.postMessage(data, '*');
      }
      const { eventType, eventData } = payload;

      // Container is already ready. In this case we just proxy all calls.
      if (isContainerReady) {
        return (postEvent as any)(eventType, eventData);
      }

      // Whenever the mini app notifies about it being ready to be shown, we should call all
      // UI-related methods that were collected before this moment. We do it to prevent
      // accidental appearance of UI components during the launcher waiting the app to be ready.
      if (eventType === 'web_app_ready') {
        group('The app is ready. Going to call previously collected events:');
        collectedUIEvents.forEach(event => {
          console.log(event);
        });
        groupEnd();
        isContainerReady = true;

        const uiColorsToSet: Partial<InitialColorsTuple> = [...initialColors];
        const uiMethods = [
          'web_app_set_header_color',
          'web_app_set_background_color',
          'web_app_set_bottom_bar_color',
        ];
        collectedUIEvents.forEach(([method, payload]: [string, any]) => {
          // As long the launcher mutates UI colors, we need to restore them as long the wrapped
          // application expects them to be initial ones. Nevertheless, we don't have to call UI
          // updates in case, the app already did it.
          const index = uiMethods.indexOf(method);
          index >= 0 && (uiColorsToSet[index] = undefined);

          // Call collected UI event.
          (postEvent as any)(method, payload);
        });
        uiMethods.forEach((method, idx) => {
          const color = uiColorsToSet[idx];
          if (color) {
            log('Restoring UI color using', { method, color });
            (postEvent as any)(
              method,
              // "web_app_setup_header_color" accepts the "color_key" parameter if non-RGB value
              // was passed. All other methods accept the "color" parameter.
              idx === 0 && !isRGB(color) ? { color_key: color } : { color },
            );
          }
        });

        clearTimeout(timeoutID);
        return props.onReady();
      }

      // All methods except specified in this list are considered as UI-affecting. We will
      // memoize them and will call whenever the app is ready to be shown.
      if (
        !([
          'iframe_ready',
          'iframe_will_reload',
          'web_app_invoke_custom_method',
          'web_app_request_content_safe_area',
          'web_app_request_safe_area',
          'web_app_request_theme',
          'web_app_request_viewport',
        ] satisfies MethodName[] as string[]).includes(eventType)
      ) {
        log('Delaying call until the app is ready:', payload);
        collectedUIEvents.push([eventType, eventData]);
        return;
      }

      (postEvent as any)(eventType, eventData);
    };

    createEventListener(window, 'message', onMessage);
  });

  return (
    <iframe
      class="app-container"
      ref={iframe}
      src={props.url}
      onError={() => {
        clearTimeout(timeoutID);
        props.onError();
      }}
    />
  );
}