<script setup lang="ts">
import { type MethodName, isRGB, postEvent } from '@telegram-apps/sdk-vue';
import { useEventListener, useTimeoutFn } from '@vueuse/core';
import { looseObject, optional, parse, string, unknown } from 'valibot';
import { onMounted, useTemplateRef } from 'vue';

import { injectGlobals, injectLogger } from '@/providers/global.js';

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

const { initialColors } = injectGlobals();
const { log, forceError } = injectLogger();

// List of collected Mini Apps events along with their parameters, which are related to the
// UI mutations.
const collectedUiEvents: { eventType: string; eventData: any }[] = [];
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

      const uiMethods = [
        { name: 'web_app_set_header_color' as const, color: initialColors.header },
        { name: 'web_app_set_background_color' as const, color: initialColors.background },
        { name: 'web_app_set_bottom_bar_color' as const, color: initialColors.bottomBar },
      ];

      // As long the launcher mutates UI colors, we need to restore them as long the wrapped
      // application expects them to be initial ones, set by itself. Nevertheless, we don't
      // have to call UI updates in case, the app already has a target color.
      //
      // So, first of all we are calling all suspended UI-mutating events. Then, we are calling
      // methods to restore initials in case they were not called previously.
      collectedUiEvents.forEach(mutation => {
        const index = uiMethods.findIndex(m => m.name === mutation.eventType);
        if (index >= 0) {
          uiMethods.splice(index, 1);
        }
        // Call collected UI event.
        (postEvent as any)(mutation.eventType, mutation.eventData);
      });
      uiMethods.forEach(({ name, color }) => {
        log('Restoring UI color using', { method: name, color });
        (postEvent as any)(
          name,
          // "web_app_setup_header_color" accepts the "color_key" parameter if non-RGB value
          // was passed. All other methods accept the "color" parameter.
          name === 'web_app_set_header_color' && !isRGB(color) ? { color_key: color } : { color },
        );
      });

      cleanupTimeout();
      return emit('ready');
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
      (postEvent as any)(eventType, eventData);
      return;
    }

    log('Delaying call until the app is ready:', { eventType, eventData });
    collectedUiEvents.push({ eventType, eventData });
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
