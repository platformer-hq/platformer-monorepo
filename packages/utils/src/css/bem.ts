import { cn, isRecord } from './cn.js';

export interface BlockFn {
  (...mods: any): string;
}

export interface ElemFn {
  (elem: string, ...mods: any): string;
}

/**
 * Applies mods to the specified element.
 * @param element - element name.
 * @param mod - mod to apply.
 */
function applyMods(element: string, mod: any): string {
  if (Array.isArray(mod)) {
    return cn(mod.map(m => applyMods(element, m)));
  }
  if (isRecord(mod)) {
    return cn(
      Object.entries(mod).map(([mod, v]) => v && applyMods(element, mod)),
    );
  }
  const v = cn(mod);
  return v && `${element}--${v}`;
}

/**
 * Computes final classname for the specified element.
 * @param element - element name.
 * @param mods - mod to apply.
 */
function computeClassnames(element: string, ...mods: any): string {
  return cn(element, applyMods(element, mods));
}

/**
 * @returns A tuple, containing two functions. The first one generates classnames list for the
 * block, the second one generates classnames for its elements.
 * @param block - BEM block name.
 */
export function bem(block: string): [BlockFn, ElemFn] {
  return [
    (...mods) => computeClassnames(block, mods),
    (elem, ...mods) => computeClassnames(`${block}__${elem}`, mods),
  ];
}