import { LibUtil } from '../utils/lib-util';
import { ParallelWorkReport } from '../work/parallel-work-report';
import { Work } from '../work/work';
import { WorkContext } from '../work/work-context';
import { WorkReport } from '../work/work-report';
import { AbstractWorkFlow } from './abstract-work-flow';

export class ParallelFlow extends AbstractWorkFlow {
  /**
   * Constructor
   * @param name workflow name
   * @param workList list of work units to run
   */
  constructor(
    name: string,
    private workList: Work[],
  ) {
    super(name);
  }

  /**
   * Execute parallel actions on the given context
   * @param workContext work context
   * @returns work report promise
   */
  async call(workContext: WorkContext) {
    // Starts the parallel execution of work units, each of which returns a promise
    const workPromises: Promise<WorkReport>[] = [];
    for (const work of this.workList) {
      // Because the executions are parallel, a copy of the context is passed for each execution
      workPromises.push(
        this.execWork(work, Object.assign(new WorkContext(), workContext)),
      );
    }

    // Calculates and returns the final state after all operations are completed
    const workReports: WorkReport[] = await Promise.all(workPromises);
    return new ParallelWorkReport(workReports);
  }

  //
  // PRIVATE
  //

  /**
   * Returns a promise on work unit runnable
   * @param work work unit
   * @param workContext work context
   * @returns work report promise
   */
  private async execWork(work: Work, workContext: WorkContext) {
    return work.call(workContext);
  }

  //
  // INNER CLASS
  //

  /**
   * Defines a builder
   */
  static Builder = class {
    name: string;
    workList: Work[];

    /**
     * Constructor
     */
    constructor() {
      this.name = LibUtil.getUUID();
      this.workList = [];
    }

    /**
     * Get a new flow builder
     */
    public static newFlow(): ParallelFlow.Builder {
      return new ParallelFlow.Builder();
    }

    /**
     * Set name
     * @param name name
     */
    public withName(name: string): ParallelFlow.Builder {
      this.name = name;
      return this;
    }

    /**
     * Add a single work unit to the list must be executed
     * @param work work unit
     */
    public addWork(work: Work): ParallelFlow.Builder {
      this.workList.push(work);
      return this;
    }

    /**
     * Set the list of work units must be executed
     * @param workList work unit list
     */
    public withWorks(workList: Work[]): ParallelFlow.Builder {
      this.workList = workList;
      return this;
    }

    /**
     * Build an instance of ParallelWorkflow
     */
    public build(): ParallelFlow {
      return new ParallelFlow(this.name, this.workList);
    }
  };
}

export namespace ParallelFlow {
  export type Builder = typeof ParallelFlow.Builder.prototype;
}
