import { beforeEach, describe, test, expect, vi } from 'vitest';
import { ContextWork, ErrorWork, PrintDateCount } from '../mock';
import { ParallelFlow } from '../../src/workflow/parallel-flow';
import { WorkContext } from '../../src/work/work-context';
import { WorkFlowEngine } from '../../src/engine/work-flow-engine';
import { WorkFlowEngineBuilder } from '../../src/engine/work-flow-engine-builder';
import { ParallelWorkReport } from '../../src/work/parallel-work-report';
import { WorkStatus } from '../../src/work/work-status';

let workFlowEngine: WorkFlowEngine;

beforeEach(() => {
  workFlowEngine = WorkFlowEngineBuilder.newBuilder().build();
});

describe('Parallel flow', () => {
  test('test exectute', async () => {
    const work = new PrintDateCount();

    const spyWork = vi.spyOn(work, 'call');

    const parallelFlow = ParallelFlow.Builder.newFlow()
      .withWorks([work, work])
      .addWork(work)
      .build();

    const workContext = new WorkContext();
    const workReport = await workFlowEngine.run(parallelFlow, workContext);
    const resultList: string[] = workReport
      .getWorkContext()
      .get(WorkContext.CTX_RESULT_LIST);
    const everyEquals: boolean = resultList.every(r => r === resultList[0]);

    expect((workReport as ParallelWorkReport).getError().length).toBe(0);
    expect(workReport.getWorkContext().isResultSingle()).toBeFalsy();
    expect(spyWork).toHaveBeenCalledTimes(3);
    expect(everyEquals).toBeTruthy();
  });

  test('test exectute without units', async () => {
    const work = new ContextWork();
    const parallelFlow = ParallelFlow.Builder.newFlow()
      .withWorks([work, work])
      .build();

    const workContext = new WorkContext();
    const workReport = await workFlowEngine.run(parallelFlow, workContext);
    const result = workReport.getWorkContext();

    expect((workReport as ParallelWorkReport).getError().length).toBe(0);
    expect(result.asMap().size).not.toBe(0);
  });

  test('test exectute with errors', async () => {
    const work1 = new PrintDateCount();
    const work2 = new ContextWork();
    const errorWork = new ErrorWork();

    const spyWork = vi.spyOn(work1, 'call');

    const parallelFlow = ParallelFlow.Builder.newFlow()
      .withWorks([work1, work1, work2])
      .addWork(errorWork)
      .build();

    const workContext = new WorkContext();
    const workReport = await workFlowEngine.run(parallelFlow, workContext);
    const resultList: string[] = workReport
      .getWorkContext()
      .get(WorkContext.CTX_RESULT_LIST);
    const everyEquals: boolean = resultList.every(r => r === resultList[0]);

    expect((workReport as ParallelWorkReport).getError().length).toBe(1);
    expect(workReport.getWorkContext().isResultSingle()).toBeFalsy();
    expect(workReport.getWorkStatus()).not.toBe(WorkStatus.COMPLETED);
    expect(spyWork).toHaveBeenCalledTimes(2);
    expect(everyEquals).toBeTruthy();
  });
});
