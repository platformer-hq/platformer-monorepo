<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { type MethodName, miniApp, postEvent } from '@tma.js/sdk-vue';
import { useEventListener, useTimeoutFn } from '@vueuse/core';
import * as v from 'valibot';

const props = defineProps<{
  /**
   * Amount of time given to the application to load.
   */
  initTimeout: number;
  /**
   * An URL to use to load the application.
   */
  src: string;
}>();
const emit = defineEmits<{
  error: [{ timeout?: boolean }];
  ready: [];
}>();

const { $init: { initialColors } } = useNuxtApp();

// List of collected mini apps events that were stopped while the launcher was waiting
// for the application to load. We will then run them when the app is ready.
const pausedRequests: { eventType: string; eventData: unknown }[] = [];
let isContainerReady = false;
const iframe = useTemplateRef('iframe');

// Give some time for the mini application to load.
// When the timeout is reached, notify the parent component about it.
const { stop: cleanupTimeout } = useTimeoutFn(
  () => emit('error', { timeout: true }),
  () => props.initTimeout,
);

onMounted(() => {
  const { contentWindow } = iframe.value || {};
  if (!contentWindow) {
    return console.error('contentWindow is missing');
  }
  // Define iframe listener to proxy all requests directed to the Telegram client.
  useEventListener(window, 'message', ({ data, source }) => {
    let request: { eventType: string; eventData?: unknown } | undefined;
    try {
      request = v.parse(v.looseObject({
        eventType: v.string(),
        eventData: v.optional(v.unknown()),
      }), JSON.parse(data));
    } catch {
      return;
    }
    if (source !== contentWindow) {
      // The event was sent from the Telegram application. Pass it to the wrapped mini app.
      // TODO: Set target origin equal to the iframe's initial domain?
      return contentWindow.postMessage(data, '*');
    }
    const { eventType, eventData } = request;

    // Container is already ready. In this case we just proxy all calls.
    if (isContainerReady) {
      // Intercept UI mutations, so after the page reload, we could restore them.
      if (eventType === 'web_app_set_header_color') {
        if (
          v.is(
            v.union([
              v.object({ color: v.string() }),
              v.object({
                color_key: v.union([
                  v.literal('bg_color'),
                  v.literal('secondary_bg_color'),
                ]),
              }),
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
      return (postEvent as any)(eventType, eventData);
    }

    // Whenever the mini app notifies about it being ready to be shown, we should call all
    // paused requests that we collected previously.
    if (eventType === 'web_app_ready') {
      console.log('The app is ready. Going to call previously collected events');
      isContainerReady = true;

      // List of requests we are going to call in order to restore initial UI colors (we are
      // changing them in the prerender script).
      const uiRequests = [
        { name: 'web_app_set_header_color' as const, color: initialColors.header },
        { name: 'web_app_set_background_color' as const, color: initialColors.background },
        { name: 'web_app_set_bottom_bar_color' as const, color: initialColors.bottomBar },
      ];
      pausedRequests.forEach(request => {
        const index = uiRequests.findIndex(m => m.name === request.eventType);
        if (index >= 0) {
          uiRequests.splice(index, 1);
        }
        (postEvent as any)(request.eventType, request.eventData);
      });
      uiRequests.forEach(({ name, color }) => {
        console.log('Restoring UI color', { method: name, color });
        if (name === 'web_app_set_header_color') {
          miniApp.setHeaderColor.ifAvailable(color);
        } else if (name === 'web_app_set_background_color') {
          miniApp.setBgColor.ifAvailable(color);
        } else {
          miniApp.setBottomBarColor.ifAvailable(color);
        }
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
      return (postEvent as any)(eventType, eventData);
    }

    console.log('Delaying call until the app is ready:', { eventType, eventData });
    pausedRequests.push({ eventType, eventData });
  });
});
</script>

<template>
  <iframe
    ref="iframe"
    class="app-frame"
    :src
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
