import { DefaultWorkReport } from './default-work-report';
import { WorkContext } from './work-context';
import { WorkStatus } from './work-status';

/**
 * Work report for broken operations
 *
 * @author  R.Stanziale
 * @version 1.0
 */
export class BrokenWorkReport extends DefaultWorkReport {
  /**
   * Constructor
   * @param workContext work context
   * @param err error object
   */
  constructor(workContext: WorkContext, err: Error) {
    super(WorkStatus.BROKEN, workContext, err);
  }
}
