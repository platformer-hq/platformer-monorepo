import { camelToKebab } from '@platformer/base';
import type {
  MiniAppGetCssVarNameFn,
  ThemeParamsGetCssVarNameFn,
  viewport,
} from '@tma.js/sdk-vue';

type ViewportCssVarName = Parameters<
  Exclude<Parameters<(typeof viewport)['bindCssVars']>[0], undefined>
>[0];
type ThemeParamsCssVarName = Parameters<ThemeParamsGetCssVarNameFn>[0];
type MiniAppCssVarName = Parameters<MiniAppGetCssVarNameFn>[0];

export function formatViewportCssVar(key: ViewportCssVarName) {
  const kebabed = camelToKebab(key);
  return key.startsWith('safeArea') || key.startsWith('contentSafeArea')
    ? `--${kebabed}`
    : `--viewport-${kebabed}`;
}

export function formatThemeParamsCssVar(key: ThemeParamsCssVarName) {
  return `--${key.replace(/_[a-z]/g, match => `-${match[1]}`)}`;
}

export function formatMiniAppCssVar(key: MiniAppCssVarName) {
  return `--app-${camelToKebab(key)}`;
}
