import { WorkFlowEngine } from './work-flow-engine';
import { WorkFlowEngineImpl } from './work-flow-engine-impl';

/**
 * Defines a workflow engine builder
 *
 * @author  R.Stanziale
 * @version 1.0
 */
export class WorkFlowEngineBuilder {
  /**
   * Get a builder instance
   */
  public static newBuilder(): WorkFlowEngineBuilder {
    return new WorkFlowEngineBuilder();
  }

  /**
   * Build a workflow engine
   */
  public build(): WorkFlowEngine {
    return new WorkFlowEngineImpl();
  }
}
