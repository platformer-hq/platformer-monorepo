import type {
  MiniAppGetCssVarNameFn,
  ThemeParamsGetCssVarNameFn,
  viewport,
} from '@tma.js/sdk-vue';
import { camelToKebab } from '@workspace/utils';

type ViewportCssVarName = Parameters<
  Exclude<Parameters<(typeof viewport)['bindCssVars']>[0], undefined>
>[0];
type ThemeParamsCssVarName = Parameters<ThemeParamsGetCssVarNameFn>[0];
type MiniAppCssVarName = Parameters<MiniAppGetCssVarNameFn>[0];

export function formatViewportCssVar(key: ViewportCssVarName) {
  return `--tg-viewport-${camelToKebab(key)}`;
}

export function formatThemeParamsCssVar(key: ThemeParamsCssVarName) {
  return `--tg-theme-${key.replace(/_[a-z]/g, match => `-${match[1]}`)}`;
}

export function formatMiniAppCssVar(key: MiniAppCssVarName) {
  return `--tg-app-${camelToKebab(key)}`;
}
