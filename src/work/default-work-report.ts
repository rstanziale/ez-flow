import { WorkContext } from './work-context';
import { WorkReport } from './work-report';
import { WorkStatus } from './work-status';

/**
 * Defines a default work report implementing the needed interface
 *
 * @author  R.Stanziale
 * @version 1.0
 */
export class DefaultWorkReport implements WorkReport {
  /**
   * Constructor
   * @param workStatus work status
   * @param workContext work context
   * @param error error (if any)
   */
  constructor(
    protected workStatus: WorkStatus,
    protected workContext: WorkContext,
    protected error?: Error,
  ) {}

  /**
   * Get work status
   * @returns work status
   */
  getWorkStatus(): WorkStatus {
    return this.workStatus;
  }

  /**
   * Get work context
   * @returns work context
   */
  getWorkContext(): WorkContext {
    return this.workContext;
  }

  /**
   * Get error (if any)
   * @returns error
   */
  getError(): undefined | Error | Error[] {
    return this.error;
  }
}
