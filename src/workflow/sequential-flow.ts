import { LibUtil } from '../utils/lib-util';
import { Work } from '../work/work';
import { WorkContext } from '../work/work-context';
import { WorkReport } from '../work/work-report';
import { WorkStatus } from '../work/work-status';
import { AbstractWorkFlow } from './abstract-work-flow';

/**
 * Define a sequential workflow.<br/>
 * It runs a list of work unit one after one until ll are completed or one fails.
 *
 * @author  R.Stanziale
 * @version 1.0
 */
export class SequentialFlow extends AbstractWorkFlow {
  /**
   * Constructor
   * @param name workflow name
   * @param workList list of work units
   */
  constructor(
    name: string,
    private workList: Work[],
  ) {
    super();
  }

  /**
   * Execute an action on the given context
   * @param workContext work context
   * @returns work report promise
   */
  async call(workContext: WorkContext): Promise<WorkReport> {
    let workReport: WorkReport;

    for (const work of this.workList) {
      workReport = await work.call(workContext);
      const workStatus = workReport.getWorkStatus();

      if (
        workReport != null &&
        (workStatus === WorkStatus.FAILED || workStatus === WorkStatus.BROKEN)
      )
        break;
    }

    return workReport!;
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
    public static newFlow(): SequentialFlow.Builder {
      return new SequentialFlow.Builder();
    }

    /**
     * Set name
     * @param name name
     */
    public withName(name: string): SequentialFlow.Builder {
      this.name = name;
      return this;
    }

    /**
     * Add a single work unit to the list must be executed
     * @param work work unit
     */
    public addWork(work: Work): SequentialFlow.Builder {
      this.workList.push(work);
      return this;
    }

    /**
     * Set the list of work units must be executed
     * @param workList work unit list
     */
    public withWorks(workList: Work[]): SequentialFlow.Builder {
      this.workList = workList;
      return this;
    }

    /**
     * Build an instance of SequentialFlow
     */
    public build(): SequentialFlow {
      return new SequentialFlow(this.name, this.workList);
    }
  };
}

export namespace SequentialFlow {
  export type Builder = typeof SequentialFlow.Builder.prototype;
}
