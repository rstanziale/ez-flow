import { beforeEach, describe, test, expect } from 'vitest';
import { NoOpWork } from '../../src/work/no-op-work';
import { WorkContext } from '../../src/work/work-context';
import { WorkReport } from '../../src/work/work-report';
import { WorkStatus } from '../../src/work/work-status';

let work: NoOpWork;

beforeEach(() => {
  work = new NoOpWork();
});

describe('No operation work', () => {
  test('has name not null', () => {
    expect(work.getName()).not.toBeNull();
  });

  test('its status is COMPLETED', async () => {
    const workReport: WorkReport = await work.call(new WorkContext());
    expect(workReport.getWorkStatus()).toEqual(WorkStatus.COMPLETED);
  });
});
