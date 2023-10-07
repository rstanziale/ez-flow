import { DefaultWorkReport } from './default-work-report';
import { WorkContext } from './work-context';
import { WorkStatus } from './work-status';

/**
 * Work report for successful operations
 *
 * @author  R.Stanziale
 * @version 1.0
 */
export class SuccessWorkReport extends DefaultWorkReport {
  /**
   * Constructor
   * @param workContext work context
   */
  constructor(workContext: WorkContext) {
    super(WorkStatus.COMPLETED, workContext);
  }
}
