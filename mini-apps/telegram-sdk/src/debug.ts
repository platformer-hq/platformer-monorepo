import { setDebug as setBridgeDebug } from '@mini-apps/telegram-bridge';

/**
 * The package debug mode.
 *
 * Enabling debug mode leads to printing additional messages in the console related to the
 * processes inside the package.
 */
export let debug = false;

/**
 * Sets the package debug mode leading to outputting additional logs. This function also modifies
 * debug mode set in the `@mini-apps/telegram-bridge` package.
 * @param value - enable debug mode.
 */
export function setDebug(value: boolean): void {
  debug = value;
  setBridgeDebug(value);
}