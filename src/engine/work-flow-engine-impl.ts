import type { WorkContext } from '../work/work-context';
import type { WorkReport } from '../work/work-report';
import type { WorkFlow } from '../workflow/work-flow';
import type { WorkFlowEngine } from './work-flow-engine';

/**
 * Implements a workflow engine
 *
 * @author  R.Stanziale
 * @version 1.0
 */
export class WorkFlowEngineImpl implements WorkFlowEngine {
  /**
   * Runs a workflow
   * @param workFlow workflow
   * @param workContext work context
   * @returns work report promise
   */
  async run(workFlow: WorkFlow, workContext: WorkContext): Promise<WorkReport> {
    return workFlow.call(workContext);
  }
}
