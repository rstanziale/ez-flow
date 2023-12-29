import { describe, test, expect } from 'vitest';
import { WorkContext } from '../../src/work/work-context';

let work: WorkContext;

describe('Work context', () => {
  test('actions', () => {
    const KEY = 'key';
    const VALUE = 'value';
    work = new WorkContext();

    work.set(KEY, VALUE);
    expect(work.asMap().size).toBeGreaterThan(0);
    expect(work.has(KEY)).toBeTruthy();

    work.delete(KEY);
    expect(work.asMap().size).toBe(0);

    work.set(KEY, VALUE);
    expect(work.get(KEY)).not.toBeNull();

    work.clear();
    expect(work.asMap().size).toBe(0);
    expect(work.isResultSingle()).toBeUndefined();

    work = new WorkContext<string>(new Map());
  });
});
