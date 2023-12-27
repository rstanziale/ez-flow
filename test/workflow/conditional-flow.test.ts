import { AlwaysFalsePredicate, PrintMessageWork } from '../mock';
import { ConditionalFlow } from '../../src/workflow/conditional-flow';
import { WorkContext } from '../../src/work/work-context';
import { WorkFlowEngine } from '../../src/engine/work-flow-engine';
import { WorkFlowEngineBuilder } from '../../src/engine/work-flow-engine-builder';

let workFlowEngine: WorkFlowEngine;

beforeEach(() => {
  workFlowEngine = WorkFlowEngineBuilder.newBuilder().build();
});

describe('Conditional flow', () => {
  it('call on predicate success', async () => {
    const work1 = new PrintMessageWork('Start');
    const work2 = new PrintMessageWork('Then');
    const work3 = new PrintMessageWork('Else');

    const spyWork1 = jest.spyOn(work1, 'call');
    const spyWork2 = jest.spyOn(work2, 'call');
    const spyWork3 = jest.spyOn(work3, 'call');

    const conditionalFlow = ConditionalFlow.Builder.newFlow()
      .withWork(work1)
      .then(work2)
      .otherwise(work3)
      .build();

    const workContext = new WorkContext();
    await workFlowEngine.run(conditionalFlow, workContext);

    expect(conditionalFlow.getName()).not.toBeNull();
    expect(spyWork1).toHaveBeenCalled();
    expect(spyWork2).toHaveBeenCalled();
    expect(spyWork3).not.toHaveBeenCalled();
  });

  it('call on predicate failure', async () => {
    const work1 = new PrintMessageWork('Start');
    const work2 = new PrintMessageWork('Then');
    const work3 = new PrintMessageWork('Else');
    const predicate = new AlwaysFalsePredicate();

    const spyWork1 = jest.spyOn(work1, 'call');
    const spyWork2 = jest.spyOn(work2, 'call');
    const spyWork3 = jest.spyOn(work3, 'call');

    const conditionalFlow = ConditionalFlow.Builder.newFlow()
      .withName('conditional flow')
      .withWork(work1)
      .when(predicate)
      .then(work2)
      .otherwise(work3)
      .build();

    const workContext = new WorkContext();
    await workFlowEngine.run(conditionalFlow, workContext);

    expect(conditionalFlow.getName()).not.toBeNull();
    expect(spyWork1).toHaveBeenCalled();
    expect(spyWork2).not.toHaveBeenCalled();
    expect(spyWork3).toHaveBeenCalled();
  });

  it('call on predicate failure without otherwise', async () => {
    const work1 = new PrintMessageWork('Start');
    const work2 = new PrintMessageWork('Then');
    const predicate = new AlwaysFalsePredicate();

    const spyWork1 = jest.spyOn(work1, 'call');
    const spyWork2 = jest.spyOn(work2, 'call');

    const conditionalFlow = ConditionalFlow.Builder.newFlow()
      .withName('conditional flow')
      .withWork(work1)
      .when(predicate)
      .then(work2)
      .build();

    const workContext = new WorkContext();
    await workFlowEngine.run(conditionalFlow, workContext);

    expect(conditionalFlow.getName()).not.toBeNull();
    expect(spyWork1).toHaveBeenCalled();
    expect(spyWork2).not.toHaveBeenCalled();
  });

  it('call with null work', async () => {
    const work1 = new PrintMessageWork('Start');
    const work2 = new PrintMessageWork('Then');
    const work3 = new PrintMessageWork('Else');
    const predicate = new AlwaysFalsePredicate();

    const spyWork1 = jest.spyOn(work1, 'call');
    const spyWork2 = jest.spyOn(work2, 'call');
    const spyWork3 = jest.spyOn(work3, 'call');

    const conditionalFlow = ConditionalFlow.Builder.newFlow()
      .withName('conditional flow')
      .withWork(work1)
      .when(predicate)
      .then(work2)
      .otherwise(work3)
      .build();

    const workContext = new WorkContext();
    await workFlowEngine.run(conditionalFlow, workContext);

    expect(conditionalFlow.getName()).not.toBeNull();
    expect(spyWork1).toHaveBeenCalled();
    expect(spyWork2).not.toHaveBeenCalled();
    expect(spyWork3).toHaveBeenCalled();
  });
});
