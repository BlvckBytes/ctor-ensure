import { expect } from 'chai';
import { ENSURE_ARRAYSIZE, evalStrThunk, pluralize, strOpt } from '../../../src';
import { checkEnsureArgErrors, executeEnsure } from '../../test-util';

describe('ENSURE_ARRAYSIZE', () => {
  const desc = (min: number, max: number) => `${strOpt(`at least ${min} array ${pluralize('element', min)}`, min > 0)}${strOpt(' and ', min > 0 && max > 0)}${strOpt(`up to ${max} array ${pluralize('element', max)}`, max > 0)}`;

  it('should have it\'s default description', () => {
    // Plural lower, no upper
    expect(evalStrThunk(ENSURE_ARRAYSIZE(5, -1).description)).to.equal(desc(5, -1));

    // Singular lower, no upper
    expect(evalStrThunk(ENSURE_ARRAYSIZE(1, -1).description)).to.equal(desc(1, -1));

    // Singular lower, singular upper
    expect(evalStrThunk(ENSURE_ARRAYSIZE(1, 1).description)).to.equal(desc(1, 1));

    // Plural lower, plural upper
    expect(evalStrThunk(ENSURE_ARRAYSIZE(2, 3).description)).to.equal(desc(2, 3));

    // no lower, singular upper
    expect(evalStrThunk(ENSURE_ARRAYSIZE(-1, 1).description)).to.equal(desc(-1, 1));

    // no lower, plural upper
    expect(evalStrThunk(ENSURE_ARRAYSIZE(-1, 3).description)).to.equal(desc(-1, 3));
  });

  it('should ignore non-array datastructures', () => {
    expect(executeEnsure(ENSURE_ARRAYSIZE(0, 0), 'this is no array')).to.have.lengthOf(0);
  });

  it('should allow array with length of range', () => {
    for (let i = 2; i <= 5; i += 1)
      expect(executeEnsure(ENSURE_ARRAYSIZE(2, 5), Array(i).fill(0))).to.have.lengthOf(0);
  });

  it('shouldn\'t allow less than min elements', () => {
    for (let i = 0; i < 2; i += 1) {
      const val = Array(i).fill(0);
      expect(executeEnsure(ENSURE_ARRAYSIZE(2, 5), val))
      .satisfy(checkEnsureArgErrors(desc(2, 5), val));
    }
  });

  it('shouldn\'t allow more than max elements', () => {
    for (let i = 6; i < 10; i += 1) {
      const val = Array(i).fill(0);
      expect(executeEnsure(ENSURE_ARRAYSIZE(2, 5), val))
      .satisfy(checkEnsureArgErrors(desc(2, 5), val));
    }
  });

  it('shouldn\'t accept smaller max than min', () => {
    expect(() => ENSURE_ARRAYSIZE(5, 4)).to.throw('Max cannot be less than min!');
  });

  it('shouldn\'t accept both bounds at -1', () => {
    expect(() => ENSURE_ARRAYSIZE(-1, -1)).to.throw('Define at least min or max!');
  });
});