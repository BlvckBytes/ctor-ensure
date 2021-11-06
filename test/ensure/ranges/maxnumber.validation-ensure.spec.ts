import { expect } from 'chai';
import { ENSURE_MAXNUMBER, evalDesc, strOpt } from '../../../src';
import { checkEnsureArgErrors, executeEnsure } from '../../test-util';

describe('ENSURE_MAXNUMBER', () => {
  const desc = (max: number) => `${strOpt(`up to ${max}`, max !== null)}`;

  const n = 10;

  it('should have it\'s default description', () => {
    expect(evalDesc(ENSURE_MAXNUMBER(n).description)).to.equal(desc(n));
  });

  it('should allow values below max', () => {
    for (let i = 1; i < 3; i += 1)
      expect(executeEnsure(ENSURE_MAXNUMBER(n), i)).to.have.lengthOf(0);
  });

  it('shouldn\'t allow values above max', () => {
    for (let i = 11; i < 15; i += 1)
      expect(executeEnsure(ENSURE_MAXNUMBER(n), i)).satisfy(checkEnsureArgErrors(desc(n), i));
  });
});

