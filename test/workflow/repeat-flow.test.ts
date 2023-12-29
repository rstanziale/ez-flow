import { beforeEach, describe, test, expect, vi } from 'vitest';
import { WorkFlowEngine } from '../../src/engine/work-flow-engine';
import { WorkFlowEngineBuilder } from '../../src/engine/work-flow-engine-builder';
import { WorkContext } from '../../src/work/work-context';
import { RepeatFlow } from '../../src/workflow/repeat-flow';
import { AlwaysFalsePredicate, BrokenWork, PrintMessageWork } from '../mock';

let workFlowEngine: WorkFlowEngine;

beforeEach(() => {
  workFlowEngine = WorkFlowEngineBuilder.newBuilder().build();
});

describe('Repeat flow', () => {
  test('test repeat until', async () => {
    const work = new PrintMessageWork('Hello');
    const predicate = new AlwaysFalsePredicate();

    const spyWork = vi.spyOn(work, 'call');

    const repeatFlow = RepeatFlow.Builder.newFlow()
      .withWork(work)
      .until(predicate)
      .build();

    const workContext = new WorkContext();
    await workFlowEngine.run(repeatFlow, workContext);

    expect(spyWork).toHaveBeenCalledTimes(1);
  });

  test('test repeat times', async () => {
    const work = new PrintMessageWork('Hello');

    const spyWork = vi.spyOn(work, 'call');

    const repeatFlow = RepeatFlow.Builder.newFlow()
      .withWork(work)
      .withTimes(3)
      .build();

    const workContext = new WorkContext();
    await workFlowEngine.run(repeatFlow, workContext);

    expect(spyWork).toHaveBeenCalledTimes(3);
  });

  test('test repeat times with broken units', async () => {
    const work = new BrokenWork();

    const spyWork = vi.spyOn(work, 'call');

    const repeatFlow = RepeatFlow.Builder.newFlow()
      .withWork(work)
      .withTimes(3)
      .build();

    const workContext = new WorkContext();
    await workFlowEngine.run(repeatFlow, workContext);

    expect(spyWork).toHaveBeenCalledTimes(1);
  });

  test('test repeat until without defined work', () => {
    expect(() => RepeatFlow.Builder.newFlow().withTimes(1).build()).toThrow();
  });

  test('test repeat without predicate', async () => {
    const work = new PrintMessageWork('Hello');

    const repeatFlow = RepeatFlow.Builder.newFlow().withWork(work).build();

    const throwThis = async () => {
      await workFlowEngine.run(repeatFlow, workContext);
    };

    const workContext = new WorkContext();
    await expect(throwThis()).rejects.toThrow(Error);
  });
});
