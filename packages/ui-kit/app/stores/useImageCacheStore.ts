import { useSessionStorage } from '@vueuse/core';

type ItemState =
  | { state: 'error' }
  | { state: 'loading' }
  | { state: 'loaded' };

type AnySource = string | { src: string; srcset?: Maybe<string> };

export const useImageCacheStore = defineStore('image-cache', () => {
  const states = useSessionStorage<Record<string, ItemState>>('image-cache', {});
  // const states = ref<Record<string, ItemState>>({});
  const normalizeSource = (source: AnySource) => (
    typeof source === 'string'
      ? { src: source }
      : { src: source.src, srcset: source.srcset || undefined }
  );
  const getKey = (sourceRef: MaybeRefOrGetter<AnySource>): string => {
    const source = normalizeSource(toValue(sourceRef));
    return [source.src, source.srcset].filter(Boolean).join('\0');
  };

  return {
    /**
     * Loads the image using specified parameters and locally stores the information that
     * the image was loaded or failed to load.
     */
    load(optionsRef: MaybeRefOrGetter<{
      src: string;
      srcset?: Maybe<string>;
    }>) {
      return computed(() => {
        const options = toValue(optionsRef);
        const stateKey = getKey(options);
        const currentState = states.value[stateKey];
        if (currentState && currentState.state !== 'error') {
          return currentState;
        }
        const img = new Image();

        img.addEventListener('load', () => {
          this.mark(options, 'loaded');
        });
        img.addEventListener('error', () => {
          this.mark(options, 'error');
        });
        img.src = options.src;
        if (options.srcset) {
          img.srcset = options.srcset;
        }
        this.mark(options, 'loading');
        return { state: 'loading' };
      });
    },
    /**
     * Marks the image with the specified status.
     */
    mark(source: MaybeRefOrGetter<AnySource>, state: 'loading' | 'loaded' | 'error') {
      states.value[getKey(source)] = { state };
    },
    /**
     * Tracks the image loading state.
     */
    track(source: MaybeRefOrGetter<AnySource>) {
      return computed<ItemState | { state: 'unknown' }>(() => {
        return states.value[getKey(source)] || { state: 'unknown' };
      });
    },
    normalizeSource,
  };
});
