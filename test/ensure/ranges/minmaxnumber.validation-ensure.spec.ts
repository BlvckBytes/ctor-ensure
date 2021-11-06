import { expect } from 'chai';
import { ENSURE_MINMAXNUMBER, evalDesc, strOpt } from '../../../src';
import { checkEnsureArgErrors, executeEnsure } from '../../test-util';

describe('ENSURE_MINMAXNUMBER', () => {
  const desc = (min: number | null, max: number | null) => `${strOpt(`at least ${min}`, min !== null)}${strOpt(' and ', min !== null && max !== null)}${strOpt(`up to ${max}`, max !== null)}`;

  const n1 = -10;
  const n2 = 10;

  it('should have it\'s default description', () => {
    // Lower, no upper
    expect(evalDesc(ENSURE_MINMAXNUMBER(n1, null).description)).to.equal(desc(n1, null));

    // Lower, singular upper
    expect(evalDesc(ENSURE_MINMAXNUMBER(n1, n2).description)).to.equal(desc(n1, n2));

    // No lower, upper
    expect(evalDesc(ENSURE_MINMAXNUMBER(null, n2).description)).to.equal(desc(null, n2));
  });

  it('should allow values inside range', () => {
    for (let i = -5; i <= 5; i += 1)
      expect(executeEnsure(ENSURE_MINMAXNUMBER(n1, n2), i)).to.have.lengthOf(0);
  });

  it('shouldn\'t allow string value', () => {
    expect(executeEnsure(ENSURE_MINMAXNUMBER(n1, n2), 'test')).satisfy(checkEnsureArgErrors(desc(n1, n2), 'test'));
  });

  it('shouldn\'t allow values below range', () => {
    for (let i = -15; i < -10; i += 1)
      expect(executeEnsure(ENSURE_MINMAXNUMBER(n1, n2), i)).satisfy(checkEnsureArgErrors(desc(n1, n2), i));
  });

  it('shouldn\'t allow values above range', () => {
    for (let i = 11; i < 16; i += 1)
      expect(executeEnsure(ENSURE_MINMAXNUMBER(n1, n2), i)).satisfy(checkEnsureArgErrors(desc(n1, n2), i));
  });

  it('shouldn\'t accept both bounds at null', () => {
    expect(() => ENSURE_MINMAXNUMBER(null, null)).to.throw('Define at least min or max!');
  });

  it('shouldn\'t accept smaller max than min', () => {
    expect(() => ENSURE_MINMAXNUMBER(n2, n1)).to.throw('Max cannot be less than min!');
  });
});

