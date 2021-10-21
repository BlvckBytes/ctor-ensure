import { expect } from 'chai';
import { ENSURE_STRUUID, evalStrThunk } from '../../src';
import { checkEnsureArgError, executeEnsure } from '../test-util';

describe('ENSURE_STRUUID', () => {
  const desc = 'uuid as string';

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_STRUUID().description)).to.equal(desc);
  });

  it('should allow string uuid', () => {
    expect(executeEnsure(ENSURE_STRUUID(), 'A5D8A2A2-C3BD-46AD-AFCC-9223B0078209')).to.have.lengthOf(0);
  });

  it('should allow empty string', () => {
    expect(executeEnsure(ENSURE_STRUUID(), '')).to.have.lengthOf(0);
  });

  it('shouldn\'t allow invalid uuid', () => {
    expect(executeEnsure(ENSURE_STRUUID(), 'A5D8A2A2-C3BD-9223B0078209')).satisfy(checkEnsureArgError(desc, 'A5D8A2A2-C3BD-9223B0078209'));
  });
});