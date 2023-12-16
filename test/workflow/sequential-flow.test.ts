import { ConcatWordCount } from '../mock';
import { SequentialFlow } from '../../src/workflow/sequential-flow';
import { WorkContext } from '../../src/work/work-context';
import { WorkFlowEngine } from '../../src/engine/work-flow-engine';
import { WorkFlowEngineBuilder } from '../../src/engine/work-flow-engine-builder';

let workFlowEngine: WorkFlowEngine;

beforeEach(() => {
  workFlowEngine = WorkFlowEngineBuilder.newBuilder().build();
});

describe('Sequential flow', () => {
  it('test exectute', async () => {
    const work1 = new ConcatWordCount('Hello');
    const work2 = new ConcatWordCount(', ');
    const work3 = new ConcatWordCount('World');

    const spyWork1 = jest.spyOn(work1, 'call');
    const spyWork2 = jest.spyOn(work2, 'call');
    const spyWork3 = jest.spyOn(work3, 'call');

    const sequentialFlow = SequentialFlow.Builder.newFlow()
      .addWork(work1)
      .addWork(work2)
      .addWork(work3)
      .build();

    const workContext = new WorkContext();
    const workReport = await workFlowEngine.run(sequentialFlow, workContext);
    const result: string = workReport
      .getWorkContext()
      .get(WorkContext.CTX_RESULT);

    expect(spyWork1).toHaveBeenCalledTimes(1);
    expect(spyWork2).toHaveBeenCalledTimes(1);
    expect(spyWork3).toHaveBeenCalledTimes(1);
    expect(result).toBe('Hello, World');
  });

  it('test passing multiple units at once', async () => {
    const work1 = new ConcatWordCount('Hello');
    const work2 = new ConcatWordCount(', ');
    const work3 = new ConcatWordCount('World');

    const spyWork1 = jest.spyOn(work1, 'call');
    const spyWork2 = jest.spyOn(work2, 'call');
    const spyWork3 = jest.spyOn(work3, 'call');

    const sequentialFlow = SequentialFlow.Builder.newFlow()
      .withWorks([work1, work2, work3])
      .build();

    const workContext = new WorkContext();
    const workReport = await workFlowEngine.run(sequentialFlow, workContext);
    const result: string = workReport
      .getWorkContext()
      .get(WorkContext.CTX_RESULT);

    expect(spyWork1).toHaveBeenCalledTimes(1);
    expect(spyWork2).toHaveBeenCalledTimes(1);
    expect(spyWork3).toHaveBeenCalledTimes(1);
    expect(result).toBe('Hello, World');
  });
});
