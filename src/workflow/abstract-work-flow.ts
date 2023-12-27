import { WorkContext } from '../work/work-context';
import { WorkReport } from '../work/work-report';
import { WorkFlow } from './work-flow';

/**
 * Defines an abstract workflow
 *
 * @author  R.Stanziale
 * @version 1.0
 */
export abstract class AbstractWorkFlow implements WorkFlow {
  /**
   * Constructor
   * @param name workflow name
   */
  constructor(private name: string) {}

  /**
   * Execute an action on the given context
   * @param workContext work context
   * @returns work report promise
   */
  abstract call(workContext: WorkContext): Promise<WorkReport>;

  /**
   * Get work unit unique name
   * @returns work unit name
   */
  getName(): string {
    return this.name;
  }
}
