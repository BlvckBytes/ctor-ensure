import { expect } from 'chai';
import { ENSURE_BOOLEAN, evalStrThunk } from '../../src';
import { checkEnsureArgError, executeEnsure } from '../test-util';

describe('ENSURE_BOOLEAN', () => {
  const desc = 'boolean value';

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_BOOLEAN().description)).to.equal(desc);
  });

  it('should allow boolean value', () => {
    expect(executeEnsure(ENSURE_BOOLEAN(), true)).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_BOOLEAN(), false)).to.have.lengthOf(0);
  });

  it('shouldn\'t allow string boolean value', () => {
    expect(executeEnsure(ENSURE_BOOLEAN(), 'true')).satisfies(checkEnsureArgError(desc, 'true'));
    expect(executeEnsure(ENSURE_BOOLEAN(), 'false')).satisfies(checkEnsureArgError(desc, 'false'));
  });
});