<script setup lang="ts">
import {
  type MethodName,
  isRGB,
  postEvent,
  setMiniAppBackgroundColor,
  setMiniAppBottomBarColor,
  setMiniAppHeaderColor,
} from '@telegram-apps/sdk-vue';
import { useEventListener, useTimeoutFn } from '@vueuse/core';
import { looseObject, optional, parse, string, unknown } from 'valibot';
import { onMounted, useTemplateRef } from 'vue';

import { injectGlobals } from '@/providers/global.js';

export interface AppFrameProps {
  loadTimeout: number;
  url: string;
}

export interface AppFrameEmits {
  error: [{ timeout?: boolean }];
  ready: [];
}

const props = defineProps<AppFrameProps>();
const emit = defineEmits<AppFrameEmits>();

const { initialColors, logger } = injectGlobals();
const { log, forceError } = logger;

// List of collected Mini Apps events along with their parameters, which are related to the
// UI mutations.
const collectedUIMutatingEvents: [string, unknown][] = [];
let isContainerReady = false;
const iframe = useTemplateRef('iframe');

// Give some time for the mini application to load.
// When the timeout is reached, notify the parent component about it.
const { stop: cleanupTimeout } = useTimeoutFn(
  () => emit('error', { timeout: true }),
  () => props.loadTimeout,
);

onMounted(() => {
  const { contentWindow } = iframe.value || {};
  if (!contentWindow) {
    return forceError('contentWindow is missing');
  }
  // Define iframe listeners to proxy all methods' calls to the Telegram client.
  // Also, do the same to proxy events from the Telegram client to the mini application.
  useEventListener(window, 'message', ({ data, source }) => {
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
      // TODO: Set target origin equal to the iframe's domain?
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
      log('The app is ready. Going to call previously collected events');
      isContainerReady = true;

      const uiMethodsMeta = [
        ['web_app_set_header_color', initialColors[0], setMiniAppHeaderColor],
        ['web_app_set_background_color', initialColors[1], setMiniAppBackgroundColor],
        ['web_app_set_bottom_bar_color', initialColors[2], setMiniAppBottomBarColor],
      ] as [MethodName, string | undefined, (color: string) => void][];
      collectedUIMutatingEvents.forEach(([method, payload]: [string, any]) => {
        // As long the launcher mutates UI colors, we need to restore them as long the wrapped
        // application expects them to be initial ones, set by itself. Nevertheless, we don't
        // have to call UI updates in case, the app already have a target color.
        const meta = uiMethodsMeta.find(tuple => tuple[0] === method);
        meta && (meta[1] = undefined);

        // Call collected UI event.
        (postEvent as any)(method, payload);
      });
      uiMethodsMeta.forEach(([method, color], idx) => {
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

      cleanupTimeout();
      return emit('ready');
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
      collectedUIMutatingEvents.push([eventType, eventData]);
      return;
    }
    (postEvent as any)(eventType, eventData);
  });
});
</script>

<template>
  <iframe
    ref="iframe"
    class="app-frame"
    :src="url"
    @error="
      cleanupTimeout();
      emit('error', {});
    "
  />
</template>

<style>
.app-frame {
  display: block;
  border: none;
  height: 100%;
  width: 100%;
}
</style>
