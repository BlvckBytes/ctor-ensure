import { expect } from 'chai';
import { ENSURE_NONNULL, evalStrThunk } from '../../src';
import { checkEnsureArgError, executeEnsure } from '../test-util';

describe('ENSURE_NONNULL', () => {
  const desc = 'no null value';

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_NONNULL().description)).to.equal(desc);
  });

  it('should allow non-null fields', () => {
    expect(executeEnsure(ENSURE_NONNULL(), 'hello world')).to.have.lengthOf(0);
  });

  it('shouldn\'t allow undefined fields', () => {
    expect(executeEnsure(ENSURE_NONNULL(), undefined)).satisfy(checkEnsureArgError(desc, undefined));
  });

  it('shouldn\'t allow null fields', () => {
    expect(executeEnsure(ENSURE_NONNULL(), null)).satisfy(checkEnsureArgError(desc, null));
  });
});