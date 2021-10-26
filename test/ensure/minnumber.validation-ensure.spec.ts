import { expect } from 'chai';
import { ENSURE_MINNUMBER, evalStrThunk, strOpt } from '../../src';
import { checkEnsureArgErrors, executeEnsure } from '../test-util';

describe('ENSURE_MINNUMBER', () => {
  const desc = (min: number) => `${strOpt(`at least ${min}`, min !== null)}`;

  const n = 10;

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_MINNUMBER(10).description)).to.equal(desc(10));
  });

  it('should allow dates above min', () => {
    for (let i = 10; i < 15; i += 1)
      expect(executeEnsure(ENSURE_MINNUMBER(n), i)).to.have.lengthOf(0);
  });

  it('shouldn\'t allow dates below min', () => {
    for (let i = 1; i < 5; i += 1)
      expect(executeEnsure(ENSURE_MINNUMBER(n), i)).satisfy(checkEnsureArgErrors(desc(n), i));
  });
});


