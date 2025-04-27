/**
 * Message log level.
 */
export type LogLevel = 'log' | 'error' | 'group';

export type LoggerOptions = [textColor: string, bgColor: string];

/*@__NO_SIDE_EFFECTS__*/
export function createLogger(
  scope: string,
  options?: LoggerOptions,
): Pick<Console, 'log' | 'error'> {
  const [textColor, bgColor] = options || [];

  /**
   * Prints a message into the console.
   * @param level - log level.
   * @param args - arguments.
   */
  function print(level: LogLevel, ...args: any[]): void {
    const commonCss = 'font-weight:bold;padding:0 3px;border-radius:5px';
    console[level](
      `%c${
        Intl
          .DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3,
            timeZone: 'UTC',
          })
          .format(new Date())
      }%c / %c${scope}`,
      `${commonCss};background-color: lightblue;color:black`,
      '',
      `${commonCss};${textColor ? `color:${textColor};` : ''}${bgColor ? `background-color:${bgColor}` : ''}`,
      ...args,
    );
  }

  return {
    log: print.bind(undefined, 'log'),
    error: print.bind(undefined, 'error'),
  };
}