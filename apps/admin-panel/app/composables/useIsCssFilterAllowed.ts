/**
 * @returns True if CSS backdrop-filter is allowed.
 */
export function useIsCssFilterAllowed() {
  const { platform, androidDeviceData } = useTmaStore();
  return computed(() => (
    androidDeviceData.performanceClass
      ? androidDeviceData.performanceClass === 'HIGH'
      // Telegram Desktop sometimes has glitches related to filters.
      : platform.raw !== 'tdesktop'
  ));
}
