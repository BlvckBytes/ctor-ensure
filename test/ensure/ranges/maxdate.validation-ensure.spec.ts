import { expect } from 'chai';
import { ENSURE_MAXDATE, evalStrThunk, strOpt } from '../../../src';
import { checkEnsureArgErrors, executeEnsure } from '../../test-util';

describe('ENSURE_MAXDATE', () => {
  const desc = (max: Date | null) => `${strOpt(`up to ${max?.toISOString()}`, max !== null)}`;

  const now = new Date();

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_MAXDATE(now).description)).to.equal(desc(now));
  });

  it('should allow dates below max', () => {
    for (let i = 1; i < 3; i += 1)
      expect(executeEnsure(ENSURE_MAXDATE(now), new Date(now.getTime() - 1000 * i))).to.have.lengthOf(0);
  });

  it('shouldn\'t allow dates above max', () => {
    for (let i = 1; i < 3; i += 1) {
      const curr = new Date(now.getTime() + 1000 * i);
      expect(executeEnsure(ENSURE_MAXDATE(now), curr)).satisfy(checkEnsureArgErrors(desc(now), curr));
    }
  });
});
