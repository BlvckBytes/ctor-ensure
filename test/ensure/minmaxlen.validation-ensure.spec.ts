import { expect } from 'chai';
import { ENSURE_MINMAXLEN, evalStrThunk, pluralize, strOpt } from '../../src';
import { checkEnsureArgErrors, executeEnsure } from '../test-util';

describe('ENSURE_MINMAXLEN', () => {
  const desc = (min: number, max: number) => `${strOpt(`at least ${min} ${pluralize('character', min)}`, min > 0)}${strOpt(' and ', min > 0 && max > 0)}${strOpt(`up to ${max} ${pluralize('character', max)}`, max > 0)}`;

  it('should have it\'s default description', () => {
    // Plural lower, no upper
    expect(evalStrThunk(ENSURE_MINMAXLEN(5, -1).description)).to.equal(desc(5, -1));

    // Singular lower, no upper
    expect(evalStrThunk(ENSURE_MINMAXLEN(1, -1).description)).to.equal(desc(1, -1));

    // Singular lower, singular upper
    expect(evalStrThunk(ENSURE_MINMAXLEN(1, 1).description)).to.equal(desc(1, 1));

    // Plural lower, plural upper
    expect(evalStrThunk(ENSURE_MINMAXLEN(2, 3).description)).to.equal(desc(2, 3));

    // no lower, singular upper
    expect(evalStrThunk(ENSURE_MINMAXLEN(-1, 1).description)).to.equal(desc(-1, 1));

    // no lower, plural upper
    expect(evalStrThunk(ENSURE_MINMAXLEN(-1, 3).description)).to.equal(desc(-1, 3));
  });

  it('should allow value with length of range', () => {
    for (let i = 2; i <= 5; i += 1)
      expect(executeEnsure(ENSURE_MINMAXLEN(2, 5), 'X'.repeat(i))).to.have.lengthOf(0);
  });

  it('shouldn\'t allow less than min characters', () => {
    for (let i = 0; i < 2; i += 1)
      expect(executeEnsure(ENSURE_MINMAXLEN(2, 5), 'X'.repeat(i))).satisfy(checkEnsureArgErrors(desc(2, 5), 'X'.repeat(i)));
  });

  it('shouldn\'t allow more than max characters', () => {
    for (let i = 6; i < 10; i += 1)
      expect(executeEnsure(ENSURE_MINMAXLEN(2, 5), 'X'.repeat(i))).satisfy(checkEnsureArgErrors(desc(2, 5), 'X'.repeat(i)));
  });

  it('shouldn\'t accept smaller max than min', () => {
    expect(() => ENSURE_MINMAXLEN(5, 4)).to.throw('Max cannot be less than min!');
  });

  it('shouldn\'t accept both bounds at -1', () => {
    expect(() => ENSURE_MINMAXLEN(-1, -1)).to.throw('Define at least min or max!');
  });
});