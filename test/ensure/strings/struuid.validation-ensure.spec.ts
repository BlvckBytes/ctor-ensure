import { expect } from 'chai';
import { ENSURE_STRUUID, evalDesc } from '../../../src';
import { checkEnsureArgErrors, executeEnsure } from '../../test-util';

describe('ENSURE_STRUUID', () => {
  const desc = 'uuid as string';

  it('should have it\'s default description', () => {
    expect(evalDesc(ENSURE_STRUUID().description)).to.equal(desc);
  });

  it('should allow string uuid', () => {
    expect(executeEnsure(ENSURE_STRUUID(), 'A5D8A2A2-C3BD-46AD-AFCC-9223B0078209')).to.have.lengthOf(0);
  });

  it('shouldn\'t allow invalid uuid', () => {
    expect(executeEnsure(ENSURE_STRUUID(), 'A5D8A2A2-C3BD-9223B0078209')).satisfy(checkEnsureArgErrors(desc, 'A5D8A2A2-C3BD-9223B0078209'));
  });
});