import type { WorkContext } from '../work/work-context';
import type { WorkReport } from '../work/work-report';
import type { WorkFlow } from '../workflow/work-flow';

/**
 * Defines an interface for a workflow engine
 *
 * @author  R.Stanziale
 * @version 1.0
 */
export interface WorkFlowEngine {
  run(workFlow: WorkFlow, workContext: WorkContext): Promise<WorkReport>;
}
