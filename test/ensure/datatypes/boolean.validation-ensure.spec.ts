import { expect } from 'chai';
import { ENSURE_BOOLEAN, evalDesc } from '../../../src';
import { checkEnsureArgErrors, executeEnsure } from '../../test-util';

describe('ENSURE_BOOLEAN', () => {
  const desc = 'boolean value';

  it('should have it\'s default description', () => {
    expect(evalDesc(ENSURE_BOOLEAN().description)).to.equal(desc);
  });

  it('should allow boolean value', () => {
    expect(executeEnsure(ENSURE_BOOLEAN(), true)).to.have.lengthOf(0);
    expect(executeEnsure(ENSURE_BOOLEAN(), false)).to.have.lengthOf(0);
  });

  it('shouldn\'t allow string boolean value', () => {
    expect(executeEnsure(ENSURE_BOOLEAN(), 'true')).satisfies(checkEnsureArgErrors(desc, 'true'));
    expect(executeEnsure(ENSURE_BOOLEAN(), 'false')).satisfies(checkEnsureArgErrors(desc, 'false'));
  });
});