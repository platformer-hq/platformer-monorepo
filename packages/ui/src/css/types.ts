export type ClassName = string | boolean | undefined | null;

export type ClassNameHook<T> = (value: T) => ClassName | ClassName[];

export type ClassesValue<HookValue> =
  | ClassName
  | ClassNameHook<HookValue>
  | (ClassName | ClassNameHook<HookValue>)[];

/**
 * Map, where key is an element key and value is according CSS class.
 */
export type ClassNamesMap<ElementKey extends string> = {
  [K in ElementKey]?: string;
};

/**
 * Map, where key is an element key, and value is the generated class name or function, which
 * generates it.
 * @example
 * const classes = {
 *   root: 'my-loader'
 *   title: ['my-title', 'my-title--big'],
 *   description: undefined,
 *   body: (props) => 'body--${props.size}'
 *   footer: () => ['my-footer', null, 'my-footer--customized', undefined]
 * };
 *
 * const computed = {
 *   root: 'my-loader',
 *   title: 'my-title my-title--big',
 *   body: 'body--small',
 *   footer: 'my-footer my-footer--customized',
 * };
 */
export type Classes<ElementKey extends string, HookValue> = {
  [K in ElementKey]?: ClassesValue<HookValue>;
};

/**
 * Mixin adding "classes" property, which is a map with local and generated class names.
 */
export interface WithOptionalClasses<ElementKey extends string, HookValue> {
  /**
   * A map, where key refers to some component element, and value is something, describing
   * class computer.
   *
   * This property changes will not be tracked anywhere, so, its value should remain the same all
   * the time. Map values changes will also not be tracked by anything.
   *
   * To do dynamic class computations, it is allowed to use functions as values. These
   * functions will be wrapped into createMemo function and will be re-called only in case,
   * tracked properties changed.
   */
  classes?: Classes<ElementKey, HookValue>;
}

export interface WithClassNamesMap<ElementKey extends string> {
  classes: ClassNamesMap<ElementKey>;
}

/**
 * Omits the "classes" property.
 */
export type OmitClasses<T> = Omit<T, 'classes'>;

export type ExtractPropsElementKey<Props> = Props extends WithOptionalClasses<any, any>
  ? Extract<keyof Exclude<Props['classes'], undefined>, string>
  : never;
