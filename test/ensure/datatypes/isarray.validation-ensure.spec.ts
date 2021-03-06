import { expect } from 'chai';
import { ENSURE_ISARRAY, evalDesc, strOpt } from '../../../src';
import { executeEnsure, checkEnsureArgErrors } from '../../test-util';

describe('ENSURE_ISARRAY', () => {

  const desc = (positive = true, unique = false, ign = false) => `${positive ? 'array of values' : 'scalar value'}${strOpt(' which is unique', unique)} ${ign ? 'ignorecase' : 'case sensitive'}`;

  it('should have it\'s default description', () => {
    expect(evalDesc(ENSURE_ISARRAY().description)).to.equal(desc());
    expect(evalDesc(ENSURE_ISARRAY(false).description)).to.equal(desc(false));
  });

  it('should allow scalar value but no array', () => {
    expect(executeEnsure(ENSURE_ISARRAY(false), 5)).to.have.lengthOf(0);

    const arr = [5];
    expect(executeEnsure(ENSURE_ISARRAY(false), arr)).satisfy(checkEnsureArgErrors(desc(false), arr));
  });

  it('should allow array but no scalar value', () => {
    expect(executeEnsure(ENSURE_ISARRAY(), [5])).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ISARRAY(), 5)).satisfy(checkEnsureArgErrors(desc(), 5));
  });

  it('should allow unique array but no scalar and no duplicate', () => {
    expect(executeEnsure(ENSURE_ISARRAY(true, true), [5])).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ISARRAY(true, true), [5, 5])).satisfy(checkEnsureArgErrors(desc(true, true), 5));
    expect(executeEnsure(ENSURE_ISARRAY(true, true), 5)).satisfy(checkEnsureArgErrors(desc(true, true), 5));
  });

  it('should allow duplicate array but no scalar', () => {
    expect(executeEnsure(ENSURE_ISARRAY(true), [5, 5])).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ISARRAY(true), 5)).satisfy(checkEnsureArgErrors(desc(), 5));
  });

  it('should allow unique array but no scalar and no case-equal duplicate', () => {
    expect(executeEnsure(ENSURE_ISARRAY(true, true), ['hi', 'Hi'])).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ISARRAY(true, true), ['hi', 'hi'])).satisfy(checkEnsureArgErrors(desc(true, true), 'hi'));
    expect(executeEnsure(ENSURE_ISARRAY(true, true), 5)).satisfy(checkEnsureArgErrors(desc(true, true), 5));
  });

  it('should allow unique array but no scalar and no duplicate, ignorecase', () => {
    expect(executeEnsure(ENSURE_ISARRAY(true, true, true), ['hi', 'bye'])).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_ISARRAY(true, true, true), ['hi', 'Hi'])).satisfy(checkEnsureArgErrors(desc(true, true, true), 'Hi'));
    expect(executeEnsure(ENSURE_ISARRAY(true, true, true), 5)).satisfy(checkEnsureArgErrors(desc(true, true, true), 5));
  });
});