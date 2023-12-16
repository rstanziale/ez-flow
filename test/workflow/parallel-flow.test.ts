import { PrintDateCount } from '../mock';
import { ParallelFlow } from '../../src/workflow/parallel-flow';
import { WorkContext } from '../../src/work/work-context';
import { WorkFlowEngine } from '../../src/engine/work-flow-engine';
import { WorkFlowEngineBuilder } from '../../src/engine/work-flow-engine-builder';
import { WorkReport } from '../../src/work/work-report';

let workFlowEngine: WorkFlowEngine;

beforeEach(() => {
  workFlowEngine = WorkFlowEngineBuilder.newBuilder().build();
});

describe('Parallel flow', () => {
  it('test exectute', async () => {
    const work = new PrintDateCount();

    const spyWork = jest.spyOn(work, 'call');

    const parallelFlow = ParallelFlow.Builder.newFlow()
      .withWorks([work, work, work])
      .build();

    const workContext = new WorkContext();
    const workReport: WorkReport = await workFlowEngine.run(
      parallelFlow,
      workContext,
    );
    const resultList: string[] = workReport
      .getWorkContext()
      .get(WorkContext.CTX_RESULT_LIST);
    const everyEquals: boolean = resultList.every(r => r === resultList[0]);

    expect(spyWork).toHaveBeenCalledTimes(3);
    expect(everyEquals).toBeTruthy();
  });
});
