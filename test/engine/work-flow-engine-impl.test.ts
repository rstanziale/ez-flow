import {
  AggregateWordCountsWork,
  CompletedPredicate,
  PrintMessageWork,
  PrintWordCount,
  WordCountWork,
} from '../mock';
import { ConditionalFlow } from '../../src/workflow/conditional-flow';
import { ParallelFlow } from '../../src/workflow/parallel-flow';
import { RepeatFlow } from '../../src/workflow/repeat-flow';
import { SequentialFlow } from '../../src/workflow/sequential-flow';
import { WorkContext } from '../../src/work/work-context';
import { WorkFlowEngine } from '../../src/engine/work-flow-engine';
import { WorkFlowEngineBuilder } from '../../src/engine/work-flow-engine-builder';
import { WorkStatus } from '../../src/work/work-status';

let workFlowEngine: WorkFlowEngine;

beforeEach(() => {
  workFlowEngine = WorkFlowEngineBuilder.newBuilder().build();
});

describe('WorkFlow engine', () => {
  it('compose workflow from separate flows and execute it', async () => {
    const work1 = new PrintMessageWork('foo');
    const work2 = new PrintMessageWork('hello');
    const work3 = new PrintMessageWork('world');
    const work4 = new PrintMessageWork('done');
    const predicate = new CompletedPredicate();

    const repeatFlow = RepeatFlow.Builder.newFlow()
      .withName('print foo 3 times')
      .withWork(work1)
      .withTimes(3)
      .build();

    const parallelFlow = ParallelFlow.Builder.newFlow()
      .withName("print 'hello' and 'world' in parallel")
      .withWorks([work2, work3])
      .build();

    const conditionalFlow = ConditionalFlow.Builder.newFlow()
      .withWork(parallelFlow)
      .when(predicate)
      .then(work4)
      .build();

    const sequentialFlow = SequentialFlow.Builder.newFlow()
      .addWork(repeatFlow)
      .addWork(conditionalFlow)
      .build();

    const workContext = new WorkContext();
    const workReport = await workFlowEngine.run(sequentialFlow, workContext);

    expect(workReport.getWorkStatus() === WorkStatus.COMPLETED);
    expect(workReport.getError()).not.toBeTruthy();
  });

  it('define workflow inline and execute it', async () => {
    const work1 = new PrintMessageWork('foo');
    const work2 = new PrintMessageWork('hello');
    const work3 = new PrintMessageWork('world');
    const work4 = new PrintMessageWork('done');
    const predicate = new CompletedPredicate();

    const workflow = SequentialFlow.Builder.newFlow()
      .addWork(
        RepeatFlow.Builder.newFlow()
          .withName('print foo 3 times')
          .withWork(work1)
          .withTimes(3)
          .build(),
      )
      .addWork(
        ConditionalFlow.Builder.newFlow()
          .withWork(
            ParallelFlow.Builder.newFlow()
              .withName("print 'hello' and 'world' in parallel")
              .withWorks([work2, work3])
              .build(),
          )
          .when(predicate)
          .then(work4)
          .build(),
      )
      .build();

    const workContext = new WorkContext();
    const workReport = await workFlowEngine.run(workflow, workContext);

    expect(workReport.getWorkStatus() === WorkStatus.COMPLETED);
    expect(workReport.getError()).not.toBeTruthy();
  });

  it('use work context to pass initial parameters and share data between work units', async () => {
    const work1 = new WordCountWork(1);
    const work2 = new WordCountWork(2);
    const work3 = new AggregateWordCountsWork();
    const work4 = new PrintWordCount();

    const workflow = SequentialFlow.Builder.newFlow()
      .addWork(ParallelFlow.Builder.newFlow().withWorks([work1, work2]).build())
      .addWork(work3)
      .addWork(work4)
      .build();

    const workContext = new WorkContext();
    workContext.set('partition1', 'hello foo');
    workContext.set('partition2', 'hello bar');

    const workReport = await workFlowEngine.run(workflow, workContext);

    expect(workReport.getWorkStatus() === WorkStatus.COMPLETED);
    expect(workReport.getWorkContext().asMap().size).toBeGreaterThan(0);
    expect(workReport.getError()).not.toBeTruthy();
  });
});
