/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineComponent, h, ref, type Component } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';

import type { KnownPlatform } from '../types.js';

interface Options<C> extends Partial<Record<KnownPlatform, C>> {
  common: C;
}

export function platformed<C extends Component>({ common, ios, android }: Options<C>): C {
  return defineComponent({
    name: 'Platformed',
    setup(props, { attrs, slots, expose }) {
      const platform = useTmaPlatform();
      const innerRef = ref<ComponentExposed<C>>();

      expose(
        new Proxy({}, {
          get(_, prop) {
            const instance = innerRef.value;
            const v = instance?.[prop];
            return typeof v === 'function'
              ? (...args: any[]) => v.apply(instance, args)
              : v;
          },
          set(_, prop, value) {
            if (!innerRef.value) {
              return false;
            }
            innerRef.value[prop] = value;
            return true;
          },
          has(_, prop) {
            return innerRef.value ? prop in innerRef.value : false;
          },
        }),
      );

      return () => {
        return h(
          ({ android, ios })[platform.value.mapped] || common,
          {
            ref: innerRef,
            ...(attrs as any),
            ...(props as any),
          },
          slots,
        );
      };
    },
  }) as unknown as C;
}
