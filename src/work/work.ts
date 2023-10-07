import { WorkContext } from './work-context';
import { WorkReport } from './work-report';

/**
 * Defines a work unit
 *
 * @author  R.Stanziale
 * @version 1.0
 */
export interface Work {
  getName(): string;
  call(workContext: WorkContext): Promise<WorkReport>;
}
