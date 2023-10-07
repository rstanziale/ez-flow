import * as uuid from 'uuid';

/**
 * General utilities for this library
 */
export class LibUtil {
  /**
   * Get an unique identifier as RFC4122 v4 UUID
   * @returns string
   */
  static getUUID(): string {
    return uuid.v4();
  }
}
