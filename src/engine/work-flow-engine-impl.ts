import { WorkContext } from '../work/work-context';
import { WorkReport } from '../work/work-report';
import { WorkFlow } from '../workflow/work-flow';
import { WorkFlowEngine } from './work-flow-engine';

/**
 * Implements a workflow engine
 *
 * @author  R.Stanziale
 * @version 1.0
 */
export class WorkFlowEngineImpl implements WorkFlowEngine {
  /**
   * Constructor
   */
  constructor() {}

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
