import { expect } from 'chai';
import { ENSURE_MINMAXDATE, evalDesc, strOpt } from '../../../src';
import { checkEnsureArgErrors, executeEnsure } from '../../test-util';

describe('ENSURE_MINMAXDATE', () => {
  const desc = (min: Date | null, max: Date | null) => `${strOpt(`at least ${min?.toISOString()}`, min !== null)}${strOpt(' and ', min !== null && max !== null)}${strOpt(`up to ${max?.toISOString()}`, max !== null)}`;

  it('should have it\'s default description', () => {
    const d1 = new Date();
    const d2 = new Date();

    // Lower, no upper
    expect(evalDesc(ENSURE_MINMAXDATE(d1, null).description)).to.equal(desc(d1, null));

    // Lower, singular upper
    expect(evalDesc(ENSURE_MINMAXDATE(d1, d2).description)).to.equal(desc(d1, d2));

    // No lower, upper
    expect(evalDesc(ENSURE_MINMAXDATE(null, d2).description)).to.equal(desc(null, d2));
  });

  const now = new Date();
  const d1 = new Date(now.getTime() - 1000 * 2);
  const d2 = new Date(now.getTime() + 1000 * 5);

  it('should allow dates inside range', () => {
    for (let i = -2; i <= 5; i += 1)
      expect(executeEnsure(ENSURE_MINMAXDATE(d1, d2), new Date(now.getTime() + 1000 * i))).to.have.lengthOf(0);
  });

  it('shouldn\'t allow date below range', () => {
    for (let i = -4; i < -2; i += 1) {
      const curr = new Date(now.getTime() + 1000 * i);
      expect(executeEnsure(ENSURE_MINMAXDATE(d1, d2), curr)).satisfy(checkEnsureArgErrors(desc(d1, d2), curr));
    }
  });

  it('shouldn\'t allow date above range', () => {
    for (let i = 6; i < 8; i += 1) {
      const curr = new Date(now.getTime() + 1000 * i);
      expect(executeEnsure(ENSURE_MINMAXDATE(d1, d2), curr)).satisfy(checkEnsureArgErrors(desc(d1, d2), curr));
    }
  });

  it('shouldn\'t accept both bounds at null', () => {
    expect(() => ENSURE_MINMAXDATE(null, null)).to.throw('Define at least min or max!');
  });

  it('shouldn\'t accept smaller max than min', () => {
    expect(() => ENSURE_MINMAXDATE(d2, d1)).to.throw('Max cannot be less than min!');
  });
});
