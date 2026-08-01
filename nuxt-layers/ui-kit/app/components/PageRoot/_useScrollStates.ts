export const useScrollStatesStore = defineStore('scroll-states', () => {
  const positions = ref<Partial<Record<string | symbol, number>>>({});

  return {
    get(name: MaybeRefOrGetter<string | symbol>) {
      return positions.value[toValue(name)];
    },
    set(name: string | symbol, value: number) {
      positions.value[name] = value;
    },
  };
});
