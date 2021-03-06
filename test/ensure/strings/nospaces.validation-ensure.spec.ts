import { expect } from 'chai';
import { ENSURE_NOSPACES, evalDesc } from '../../../src';
import { checkEnsureArgErrors, executeEnsure } from '../../test-util';

describe('ENSURE_NOSPACES', () => {
  const desc = 'can\'t contain spaces';

  it('should have it\'s default description', () => {
    expect(evalDesc(ENSURE_NOSPACES().description)).to.equal(desc);
  });

  it('should allow non-space string', () => {
    expect(executeEnsure(ENSURE_NOSPACES(), 'hello')).to.have.lengthOf(0);
  });

  it('should allow empty string', () => {
    expect(executeEnsure(ENSURE_NOSPACES(), '')).to.have.lengthOf(0);
  });

  it('shouldn\'t allow space string', () => {
    expect(executeEnsure(ENSURE_NOSPACES(), 'hello world')).satisfy(checkEnsureArgErrors(desc, 'hello world'));
  });
});