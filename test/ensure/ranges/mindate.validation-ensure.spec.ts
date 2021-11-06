import { expect } from 'chai';
import { ENSURE_MINDATE, evalDesc, strOpt } from '../../../src';
import { checkEnsureArgErrors, executeEnsure } from '../../test-util';

describe('ENSURE_MINDATE', () => {
  const desc = (min: Date | null) => `${strOpt(`at least ${min?.toISOString()}`, min !== null)}`;

  const now = new Date();

  it('should have it\'s default description', () => {
    expect(evalDesc(ENSURE_MINDATE(now).description)).to.equal(desc(now));
  });

  it('should allow dates above min', () => {
    for (let i = 1; i < 3; i += 1)
      expect(executeEnsure(ENSURE_MINDATE(now), new Date(now.getTime() + 1000 * i))).to.have.lengthOf(0);
  });

  it('shouldn\'t allow dates below min', () => {
    for (let i = 1; i < 3; i += 1) {
      const curr = new Date(now.getTime() - 1000 * i);
      expect(executeEnsure(ENSURE_MINDATE(now), curr)).satisfy(checkEnsureArgErrors(desc(now), curr));
    }
  });
});

