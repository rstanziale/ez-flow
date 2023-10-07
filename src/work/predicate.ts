import { WorkReport } from './work-report';

/**
 * Defines a general predicate
 *
 * @author  R.Stanziale
 * @version 1.0
 */
export interface Predicate {
  /**
   * Apply a predicate.<br/>
   * Return true or false
   * @param workReport work report
   * @return Promise<boolean> true|false
   */
  apply(workReport: WorkReport): Promise<boolean>;
}
