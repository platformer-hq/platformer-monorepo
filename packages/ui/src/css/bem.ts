import { classNames, isRecord } from './classnames.js';

export interface BlockFn {
  (...mods: any): string;
}

export interface ElemFn {
  (elem: string, ...mods: any): string;
}

export interface ElemGenFn {
  (elemBase: string): (elem?: string, ...mods: any) => string;
}

/**
 * Applies mods to the specified element.
 * @param element - element name.
 * @param mod - mod to apply.
 */
function applyMods(element: string, mod: any): string {
  if (Array.isArray(mod)) {
    return classNames(mod.map(m => applyMods(element, m)));
  }
  if (isRecord(mod)) {
    return classNames(
      Object.entries(mod).map(([mod, v]) => v && applyMods(element, mod)),
    );
  }
  const v = classNames(mod);
  return v && `${element}--${v}`;
}

/**
 * Computes final classname for the specified element.
 * @param element - element name.
 * @param mods - mod to apply.
 */
function computeClassnames(element: string, ...mods: any): string {
  return classNames(element, applyMods(element, mods));
}

/**
 * @returns A tuple, containing two functions. The first one generates classnames list for the
 * block, the second one generates classnames for its elements.
 * @param block - BEM block name.
 */
export function bem(block: string): [BlockFn, ElemFn, ElemGenFn] {
  const elemFn: ElemFn = (elem, ...mods) => {
    return computeClassnames(`${block}__${elem}`, mods);
  };
  return [
    (...mods) => computeClassnames(block, mods),
    elemFn,
    elemBase => (elem, ...mods) => elemFn(
      `${elemBase}${elem ? `-${elem}` : ''}`,
      mods,
    ),
  ];
}