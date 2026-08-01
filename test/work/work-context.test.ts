import { describe, expect, test } from 'vitest';
import { WorkContext } from '../../src/work/work-context';

let work: WorkContext;

describe('Work context', () => {
  test('actions', () => {
    const Key = 'key';
    const Value = 'value';
    work = new WorkContext();

    work.set(Key, Value);
    expect(work.asMap().size).toBeGreaterThan(0);
    expect(work.has(Key)).toBeTruthy();

    work.delete(Key);
    expect(work.asMap().size).toBe(0);

    work.set(Key, Value);
    expect(work.get(Key)).not.toBeNull();

    work.clear();
    expect(work.asMap().size).toBe(0);
    expect(work.isResultSingle()).toBeUndefined();

    work = new WorkContext<string>(new Map());
  });
});
