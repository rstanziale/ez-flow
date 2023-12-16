import { AlwaysFalsePredicate, PrintMessageWork } from '../mock';
import { RepeatFlow } from '../../src/workflow/repeat-flow';
import { WorkContext } from '../../src/work/work-context';
import { WorkFlowEngine } from '../../src/engine/work-flow-engine';
import { WorkFlowEngineBuilder } from '../../src/engine/work-flow-engine-builder';

let workFlowEngine: WorkFlowEngine;

beforeEach(() => {
  workFlowEngine = WorkFlowEngineBuilder.newBuilder().build();
});

describe('Repeat flow', () => {
  it('test repeat until', async () => {
    const work = new PrintMessageWork('Hello');
    const predicate = new AlwaysFalsePredicate();

    const spyWork = jest.spyOn(work, 'call');

    const repeatFlow = RepeatFlow.Builder.newFlow()
      .withWork(work)
      .until(predicate)
      .build();

    const workContext = new WorkContext();
    await workFlowEngine.run(repeatFlow, workContext);

    expect(spyWork).toHaveBeenCalledTimes(1);
  });

  it('test repeat times', async () => {
    const work = new PrintMessageWork('Hello');

    const spyWork = jest.spyOn(work, 'call');

    const repeatFlow = RepeatFlow.Builder.newFlow()
      .withWork(work)
      .withTimes(3)
      .build();

    const workContext = new WorkContext();
    await workFlowEngine.run(repeatFlow, workContext);

    expect(spyWork).toHaveBeenCalledTimes(3);
  });
});
