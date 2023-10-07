import { LibUtil } from '../utils/lib-util';
import { DefaultWorkReport } from '../work/default-work-report';
import { NoOpWork } from '../work/no.op.work';
import { Predicate } from '../work/predicate';
import { Work } from '../work/work';
import { WorkContext } from '../work/work-context';
import { WorkReport } from '../work/work-report';
import { WorkReportPredicate } from '../work/work-report-predicate';
import { WorkStatus } from '../work/work-status';
import { AbstractWorkFlow } from './abstract-work-flow';

/**
 * Defines a conditional workflow
 *
 * @author  R.Stanzialee
 * @version 1.0
 */
export class ConditionalFlow extends AbstractWorkFlow {
  /**
   * Constructor
   * @param name work name
   * @param toExecute work to execute
   * @param nextOnTrue work to execute on success or true predicate
   * @param nextOnFalse work to execute on failure or false predicate (optional)
   * @param predicate predicate function (optional)
   */
  constructor(
    name: string,
    private toExecute: Work,
    private nextOnTrue: Work,
    private nextOnFalse?: Work,
    private predicate?: Predicate,
  ) {
    super(name);
  }

  /**
   * Execute an action on the given context
   *
   * It can work in 2 ways:
   * 1) a main statement is specified to be executed (withWork), the result of which is used as a predicate to be evaluated
   * 2) an explicit predicate (when) is specified to be evaluated
   * @param workContext work context
   * @returns work report promise
   */
  async call(workContext: WorkContext) {
    let returnReport: WorkReport;
    if (this.toExecute != null) {
      // Executes main work unit
      returnReport = await this.toExecute.call(workContext);
    } else {
      returnReport = new DefaultWorkReport(WorkStatus.COMPLETED, workContext);
    }

    // If there is no explicit predicate, then the predicate is based on the execution state (COMPLETED, FAILED).
    if (!this.predicate) {
      this.predicate = new WorkReportPredicate();
    }

    // Evaluates the predicate
    const predicateVal = await this.predicate.apply(returnReport);
    if (predicateVal) {
      // If true, executes the work item 'nextOnTrue'
      returnReport = await this.nextOnTrue.call(workContext);
    } else {
      // If it is 'false' and a 'nextOnFalse' unit is specified, then execute it
      if (this.nextOnFalse && !(this.nextOnFalse instanceof NoOpWork)) {
        returnReport = await this.nextOnFalse.call(workContext);
      }
    }

    return returnReport;
  }

  //
  // INNER CLASS
  //

  /**
   * Defines a builder
   */
  static Builder = class {
    name: string;
    toExecute: Work;
    nextOnTrue: Work;
    nextOnFalse: Work;
    predicate: Predicate | undefined;

    /**
     * Constructor
     */
    constructor() {
      this.name = LibUtil.getUUID();
      this.toExecute = new NoOpWork();
      this.nextOnTrue = new NoOpWork();
      this.nextOnFalse = new NoOpWork();
    }

    /**
     * Get a new flow builder
     */
    public static newFlow(): ConditionalFlow.Builder {
      return new ConditionalFlow.Builder();
    }

    /**
     * Set name
     * @param name name
     */
    public withName(name: string): ConditionalFlow.Builder {
      this.name = name;
      return this;
    }

    /**
     * Set work to be execute
     * @param work work unit
     */
    public withWork(work: Work): ConditionalFlow.Builder {
      this.toExecute = work;
      return this;
    }

    /**
     * Set work to be execute if predicate is true
     * @param work work unit
     */
    public then(work: Work): ConditionalFlow.Builder {
      this.nextOnTrue = work;
      return this;
    }

    /**
     * Set work to be execute if predicate is false
     * @param work work unit
     */
    public otherwise(work: Work): ConditionalFlow.Builder {
      this.nextOnFalse = work;
      return this;
    }

    /**
     * Set predicate function
     * @param predicate predicate function
     */
    public when(predicate: Predicate): ConditionalFlow.Builder {
      this.predicate = predicate;
      return this;
    }

    /**
     * Build an instance of ConditionalFlow
     */
    public build(): ConditionalFlow {
      if (this.predicate) {
        return new ConditionalFlow(
          this.name,
          this.toExecute,
          this.nextOnTrue,
          this.nextOnFalse,
          this.predicate,
        );
      } else {
        return new ConditionalFlow(
          this.name,
          this.toExecute,
          this.nextOnTrue,
          this.nextOnFalse,
        );
      }
    }
  };
}

export namespace ConditionalFlow {
  export type Builder = typeof ConditionalFlow.Builder.prototype;
}
