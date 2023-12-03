import { LibUtil } from '../utils/lib-util';
import { DefaultWorkReport } from './default-work-report';
import { Work } from './work';
import { WorkContext } from './work-context';
import { WorkReport } from './work-report';
import { WorkStatus } from './work-status';

/**
 * Defines a work unit that does nothing
 *
 * @author  R.Stanzialee
 * @version 1.0
 */
export class NoOpWork implements Work {
  /**
   * Get work unit unique name
   * @returns work unit name
   */
  getName(): string {
    return LibUtil.getUUID();
  }

  /**
   * Execute an action on the given context
   * @param workContext work context
   * @returns work report
   */
  async call(workContext: WorkContext): Promise<WorkReport> {
    return new DefaultWorkReport(WorkStatus.COMPLETED, workContext);
  }
}
