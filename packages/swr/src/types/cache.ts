export interface CachedData<D> {
  /**
   * Cache creation timestamp.
   */
  timestamp: number;
  /**
   * Cached data.
   */
  data: D;
}
