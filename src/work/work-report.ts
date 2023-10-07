import { WorkContext } from './work-context';
import { WorkStatus } from './work-status';

/**
 * Defines a work repot unit
 *
 * @author  R.Stanziale
 * @version 1.0
 */
export interface WorkReport {
  getWorkStatus(): WorkStatus;
  getWorkContext(): WorkContext;
  getError(): undefined | Error | Error[];
}
