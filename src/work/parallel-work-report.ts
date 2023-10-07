import { WorkContext } from './work-context';
import { WorkReport } from './work-report';
import { WorkStatus } from './work-status';

/**
 * Defines a work report used in parallel workflow
 *
 * @author  R.Stanziale
 * @version 1.0
 */
export class ParallelWorkReport implements WorkReport {
  /**
   * Constructor
   * @param workReportList list of work reports
   */
  constructor(private workReportList: WorkReport[]) {}

  /**
   * Get error (if any)
   * @returns error
   */
  getError(): Error | Error[] {
    const errors: Error[] = [];

    for (const workReport of this.workReportList) {
      const error = <Error>workReport.getError();
      if (error != null) {
        errors.push(error);
      }
    }

    return errors;
  }

  /**
   * Get work context
   * @returns work context
   */
  getWorkContext(): WorkContext {
    const workContext = new WorkContext();
    const multiResult: any[] = [];

    for (const workReport of this.workReportList) {
      const tmpWorkContext = workReport.getWorkContext();
      tmpWorkContext.forEach((value, key) => {
        // if each parallel unit produced a result, each is collected in a specific array
        if (key === WorkContext.CTX_RESULT) {
          multiResult.push(value);
        } else {
          workContext.set(key, value);
        }
      });
    }

    // If there are multiple results, it returns them in an appropriate key
    if (multiResult.length > 0) {
      workContext.set(WorkContext.CTX_RESULT_LIST, multiResult);
    }

    return workContext;
  }

  /**
   * Get work status
   * @returns work status
   */
  getWorkStatus(): WorkStatus {
    for (const workReport of this.workReportList) {
      const workStatus = workReport.getWorkStatus();
      if (workStatus === WorkStatus.FAILED || workStatus === WorkStatus.BROKEN)
        return workStatus;
    }

    return WorkStatus.COMPLETED;
  }
}
