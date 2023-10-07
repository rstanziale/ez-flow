/**
 * Defines a "work context" as a map
 *
 * @author  R.Stanziale
 * @version 1.0
 */
export class WorkContext<Type = any> {
  // context special keys
  static CTX_RESULT = 'RESULT'; // Used to store the result of a work unit
  static CTX_RESULT_LIST = 'RESULTS'; // Used to store parallel flow results

  private map: Map<string, Type>;

  /**
   * Constructor
   * @param map external map (optional)
   */
  constructor(map?: Map<string, Type>) {
    this.map = map ? map : new Map<string, Type>();
  }

  /**
   * Get value for the given key
   * @param key key
   * @returns value
   */
  get(key: string): Type | undefined {
    return this.map.get(key);
  }

  /**
   * Set a value for the given key
   * @param key key
   * @param value value to set
   */
  set(key: string, value: Type) {
    this.map.set(key, value);
  }

  /**
   * Delete a value for the given key
   * @param key key
   */
  delete(key: string) {
    this.map.delete(key);
  }

  /**
   * Check if exists a value for the given key
   * @param key key
   * @returns true|false
   */
  has(key: string): boolean {
    return this.map.has(key);
  }

  /**
   * Clear all key/value pairs
   */
  clear() {
    this.map.clear();
  }

  /**
   * Run an action for each item in the map
   * @param callbackFn callback to run
   */
  forEach(
    callbackFn: (value: Type, key: string, map: Map<string, Type>) => void,
  ) {
    this.map.forEach(callbackFn);
  }

  /**
   * Get content as map
   * @returns content as map
   */
  asMap(): Map<string, Type> {
    return this.map;
  }

  /**
   * Check if the work context contains a result
   * @returns true|false
   */
  hasResult(): boolean {
    return (
      this.map.has(WorkContext.CTX_RESULT) ||
      this.map.has(WorkContext.CTX_RESULT_LIST)
    );
  }

  /**
   * Check if the work context contains a single or multiple result
   * @returns true if single, false if multiple, undefined if doesn't contain any result
   */
  isResultSingle(): boolean | undefined {
    if (!this.hasResult()) return undefined;
    return this.map.has(WorkContext.CTX_RESULT);
  }
}
