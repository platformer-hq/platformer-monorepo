/**
 * Formats the number inserting comma between every three digits starting from the end.
 * @param num - number to format.
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}
