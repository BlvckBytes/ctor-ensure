import { expect } from 'chai';
import { ENSURE_ISDATE, evalStrThunk } from '../../src';
import { checkEnsureArgErrors, executeEnsure } from '../test-util';

describe('ENSURE_ISDATE', () => {
  const desc = 'valid JS date object';

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_ISDATE().description)).to.equal(desc);
  });

  it('should allow date value', () => {
    expect(executeEnsure(ENSURE_ISDATE(), new Date())).to.have.lengthOf(0);
  });

  it('shouldn\'t allow string date value', () => {
    expect(executeEnsure(ENSURE_ISDATE(), '01.02.2003')).satisfy(checkEnsureArgErrors(desc, '01.02.2003'));
  });

  it('shouldn\'t allow fake object value', () => {
    const obj = {
      getTime: () => 0,
    };
    expect(executeEnsure(ENSURE_ISDATE(), obj)).satisfy(checkEnsureArgErrors(desc, obj));
  });
});
