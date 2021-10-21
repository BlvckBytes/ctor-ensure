import { expect } from 'chai';
import { ENSURE_NOSPACES, evalStrThunk } from '../../src';
import { checkEnsureArgError, executeEnsure } from '../test-util';

describe('ENSURE_NOSPACES', () => {
  const desc = 'can\'t contain spaces';

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_NOSPACES().description)).to.equal(desc);
  });

  it('should allow non-space string', () => {
    expect(executeEnsure(ENSURE_NOSPACES(), 'hello')).to.have.lengthOf(0);
  });

  it('should allow empty string', () => {
    expect(executeEnsure(ENSURE_NOSPACES(), '')).to.have.lengthOf(0);
  });

  it('shouldn\'t allow space string', () => {
    expect(executeEnsure(ENSURE_NOSPACES(), 'hello world')).satisfy(checkEnsureArgError(desc, 'hello world'));
  });
});