import { DefaultWorkReport } from '../src/work/default-work-report';
import { BrokenWorkReport } from '../src/work/broken-work-report';
import { FailureWorkReport } from '../src/work/failure-work-report';
import { Predicate } from '../src/work/predicate';
import { Work } from '../src/work/work';
import { WorkContext } from '../src/work/work-context';
import { WorkReport } from '../src/work/work-report';
import { WorkStatus } from '../src/work/work-status';

export class AlwaysTruePredicate implements Predicate {
  async apply() {
    return true;
  }
}

export class AlwaysFalsePredicate implements Predicate {
  async apply() {
    return false;
  }
}

export class CompletedPredicate implements Predicate {
  async apply(workReport: WorkReport) {
    return workReport.getWorkStatus() === WorkStatus.COMPLETED;
  }
}

export class BrokenWork implements Work {
  getName() {
    return 'broken work';
  }

  async call(workContext: WorkContext): Promise<WorkReport> {
    return new BrokenWorkReport(workContext, new Error('workflow interrupted'));
  }
}

export class ErrorWork implements Work {
  getName() {
    return 'error work';
  }

  async call(workContext: WorkContext): Promise<WorkReport> {
    return new FailureWorkReport(workContext, new Error('workflow error'));
  }
}

export class PrintMessageWork implements Work {
  private message: string;

  constructor(message: string) {
    this.message = message;
  }

  getName() {
    return 'print message work';
  }

  async call(workContext: WorkContext): Promise<WorkReport> {
    console.log(this.message);
    return new DefaultWorkReport(WorkStatus.COMPLETED, workContext);
  }
}

export class WordCountWork implements Work {
  private partition: number;

  constructor(partition: number) {
    this.partition = partition;
  }

  getName() {
    return 'count words in a given string';
  }

  async call(workContext: WorkContext): Promise<WorkReport> {
    const input: string = workContext.get(`partition${this.partition}`);
    workContext.set(
      `wordCountInPartition${this.partition}`,
      input.split(' ').length,
    );
    return new DefaultWorkReport(WorkStatus.COMPLETED, workContext);
  }
}

export class AggregateWordCountsWork implements Work {
  getName() {
    return 'aggregate word counts from partitions';
  }

  async call(workContext: WorkContext): Promise<WorkReport> {
    let sum = 0;
    workContext.forEach((value: any, key: string) => {
      if (key.includes('InPartition')) {
        sum += value;
      }
    });

    workContext.set('totalCount', sum);
    return new DefaultWorkReport(WorkStatus.COMPLETED, workContext);
  }
}

export class PrintWordCount implements Work {
  getName() {
    return 'print total word count';
  }

  async call(workContext: WorkContext): Promise<WorkReport> {
    const totalCount: number = workContext.get('totalCount');
    console.log(totalCount);
    return new DefaultWorkReport(WorkStatus.COMPLETED, workContext);
  }
}

export class PrintDateCount implements Work {
  getName() {
    return 'print date';
  }

  async call(workContext: WorkContext): Promise<WorkReport> {
    const date: string = new Date().toISOString();
    workContext.set(WorkContext.CTX_RESULT, date);
    return new DefaultWorkReport(WorkStatus.COMPLETED, workContext);
  }
}

export class ContextWork implements Work {
  getName() {
    return 'context work';
  }

  async call(workContext: WorkContext): Promise<WorkReport> {
    workContext.set('test', 'this is a test');
    return new DefaultWorkReport(WorkStatus.COMPLETED, workContext);
  }
}

export class ConcatWordCount implements Work {
  private word: string;

  constructor(word: string) {
    this.word = word;
  }

  getName() {
    return 'concat word';
  }

  async call(workContext: WorkContext): Promise<WorkReport> {
    const previousWord: string = workContext.get(WorkContext.CTX_RESULT) ?? '';
    workContext.set(WorkContext.CTX_RESULT, `${previousWord}${this.word}`);
    return new DefaultWorkReport(WorkStatus.COMPLETED, workContext);
  }
}
