import { expect } from 'chai';
import { ENSURE_ARRAYSIZEMIN, evalStrThunk, pluralize } from '../../../src';
import { checkEnsureArgErrors, executeEnsure } from '../../test-util';

describe('ENSURE_ARRAYSIZEMIN', () => {
  const desc = (min: number) => `at least ${min} array ${pluralize('element', min)}`;

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_ARRAYSIZEMIN(5).description)).equal(desc(5));
    expect(evalStrThunk(ENSURE_ARRAYSIZEMIN(1).description)).equal(desc(1));
  });

  it('should allow more than min elements', () => {
    for (let i = 5; i <= 10; i += 1)
      expect(executeEnsure(ENSURE_ARRAYSIZEMIN(5), Array(i).fill(0))).to.have.lengthOf(0);
  });

  it('shouldn\'t allow less than min elements', () => {
    for (let i = 0; i < 5; i += 1) {
      const val = Array(i).fill(0);
      expect(executeEnsure(ENSURE_ARRAYSIZEMIN(5), val)).satisfy(checkEnsureArgErrors(desc(5), val));
    }
  });
});