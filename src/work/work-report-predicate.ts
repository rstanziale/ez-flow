import { Predicate } from './predicate';
import { WorkReport } from './work-report';
import { WorkStatus } from './work-status';

/**
 * Defines a predicate for work report
 *
 * @author  R.Stanziale
 * @version 1.0
 */
export class WorkReportPredicate implements Predicate {
  /**
   * Apply a predicate to work report.<br/>
   * Return true if COMPLETED, false if FAILED
   * @param workReport work report
   * @return Promise<boolean> true|false
   */
  apply(workReport: WorkReport): Promise<boolean> {
    return Promise.resolve(workReport.getWorkStatus() === WorkStatus.COMPLETED);
  }
}
