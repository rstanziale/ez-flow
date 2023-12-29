import { LibUtil } from '../utils/lib-util';
import { Predicate } from '../work/predicate';
import { Work } from '../work/work';
import { WorkContext } from '../work/work-context';
import { WorkReport } from '../work/work-report';
import { WorkReportPredicate } from '../work/work-report-predicate';
import { AbstractWorkFlow } from './abstract-work-flow';

/**
 * Defines a repeating workflow.<br/>
 * It runs more times the work unit, until the predicate becomes false (if no times is set).<br/>
 * If 'times' is set, then repeat 'times' or breaks on failed predicate
 *
 * @author  R.Stanziale
 * @version 1.0
 */
export class RepeatFlow extends AbstractWorkFlow {
  /**
   * Constructor
   * @param name workflow unit name
   * @param work work unit
   * @param times times to iterate (optional)
   * @param predicate predicate function (optional)
   */
  constructor(
    name: string,
    private work: Work,
    private times: number,
    private predicate?: Predicate,
  ) {
    super(name);
  }

  /**
   * Execute an action on the given context
   * @param workContext work context
   * @returns work report promise
   */
  async call(workContext: WorkContext) {
    return this.times && this.times > 0
      ? this.doFor(workContext)
      : this.doLoop(workContext);
  }

  //
  // PRIVATE
  //

  /**
   * Execute a loop for 'times' times or breaks on failed predicate
   * @param workContext work context
   * @returns work report promise
   */
  private async doFor(workContext: WorkContext) {
    let workReport: WorkReport;
    const predicate = new WorkReportPredicate();
    let predicateVal: boolean;

    for (let i = 0; i < this.times; i++) {
      workReport = await this.work.call(workContext);
      predicateVal = await predicate.apply(workReport);

      if (!predicateVal) {
        break;
      }
    }

    return workReport!;
  }

  /**
   * Execute a loop until predicate becomes FAILED
   * @param workContext work context
   * @returns work report promise
   */
  private async doLoop(workContext: WorkContext) {
    let workReport: WorkReport;

    if (!this.predicate) {
      throw new Error('[ERROR] Aborting repeat flow. No predicate defined');
    }

    let predicateVal: boolean;
    do {
      workReport = await this.work.call(workContext);
      predicateVal = await this.predicate.apply(workReport);
    } while (predicateVal);

    return workReport;
  }

  //
  // INNER CLASS
  //

  /**
   * Defines a builder
   */
  static Builder = class {
    name: string;
    work: Work | undefined;
    times: number = 0;
    predicate: Predicate | undefined;

    /**
     * Constructor
     */
    constructor() {
      this.name = LibUtil.getUUID();
    }

    /**
     * Get a new flow builder
     */
    public static newFlow(): RepeatFlow.Builder {
      return new RepeatFlow.Builder();
    }

    /**
     * Set name
     * @param name name
     */
    public withName(name: string): RepeatFlow.Builder {
      this.name = name;
      return this;
    }

    /**
     * Set the work unit to execute
     * @param work work unit
     */
    public withWork(work: Work): RepeatFlow.Builder {
      this.work = work;
      return this;
    }

    /**
     * Set times to repeat the work unit execution
     * @param times times
     */
    public withTimes(times: number): RepeatFlow.Builder {
      this.times = times;
      return this;
    }

    /**
     * Set predicate function
     * @param predicate predicate function
     */
    public until(predicate: Predicate): RepeatFlow.Builder {
      this.predicate = predicate;
      return this;
    }

    /**
     * Build an instance of RepeatFlow
     */
    public build(): RepeatFlow {
      if (!this.work) {
        throw new Error('[ERROR] Aborting repeat flow. No work defined');
      }

      return this.times && this.times > 0
        ? new RepeatFlow(this.name, this.work, this.times)
        : new RepeatFlow(this.name, this.work, 0, this.predicate);
    }
  };
}

export namespace RepeatFlow {
  export type Builder = typeof RepeatFlow.Builder.prototype;
}
