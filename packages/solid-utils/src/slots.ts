import {
  children,
  type Component,
  type JSXElement,
  type ParentProps,
} from 'solid-js';

export interface SlotBox<Type, Props> {
  id: symbol;
  type: Type;
  props: Props;
}

/*@__NO_SIDE_EFFECTS__*/
export function slotGen<PropsMap extends Record<string, any>>() {
  const id = Symbol('SlotBox');

  function filter<T extends keyof PropsMap>(props: ParentProps, type: T): PropsMap[T] | undefined;
  function filter<T extends keyof PropsMap>(
    props: ParentProps,
    type: T,
    many: true,
  ): PropsMap[T][];
  function filter<T extends keyof PropsMap>(
    props: ParentProps,
    type: T,
    many?: true,
  ): undefined | PropsMap[T] | PropsMap[T][] {
    const boxes = children(() => props.children)
      .toArray()
      .reduce<PropsMap[T][]>((acc, child) => {
        if (
          !!child
          && typeof child === 'object'
          && (child as any).id === id
          && (child as any).type === type
        ) {
          acc.push((child as unknown as SlotBox<T, PropsMap[T]>).props);
        }
        return acc;
      }, []);

    return many ? boxes : boxes[0];
  }

  return [
    /* @__PURE__ */ <T extends keyof PropsMap>(type: T): Component<PropsMap[T]> => {
      return props => {
        // We trick TypeScript on purpose, so JSX boxes could properly be returned in components.
        return { type, props, id } satisfies SlotBox<T, PropsMap[T]> as unknown as JSXElement;
      };
    },
    /* @__PURE__ */ filter,
  ] as const;
}
