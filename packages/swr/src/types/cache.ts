export interface CachedData<D> {
  /**
   * Cached data.
   */
  data: D;
  /**
   * Cache creation timestamp.
   */
  timestamp: number;
}
