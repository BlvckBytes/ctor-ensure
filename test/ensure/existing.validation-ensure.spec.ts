import { expect } from 'chai';
import { ENSURE_EXISTING, evalStrThunk } from '../../src';
import { checkEnsureArgErrors, executeEnsure } from '../test-util';

describe('ENSURE_EXISTING', () => {
  const desc = 'mandatory field';

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_EXISTING().description)).to.equal(desc);
  });

  it('should allow defined fields', () => {
    expect(executeEnsure(ENSURE_EXISTING(), 'defined')).to.have.lengthOf(0);
  });

  it('shouldn\'t allow undefined fields', () => {
    expect(executeEnsure(ENSURE_EXISTING(), undefined)).satisfy(checkEnsureArgErrors(desc, undefined));
  });
});