import { expect } from 'chai';
import { ENSURE_NONEMPTY, evalStrThunk } from '../../src';
import { checkEnsureArgError, executeEnsure } from '../test-util';

describe('ENSURE_NONEMPTY', () => {
  const desc = 'no empty value';

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_NONEMPTY().description)).to.equal(desc);
  });

  it('should allow non-empty string', () => {
    expect(executeEnsure(ENSURE_NONEMPTY(), 'hello world')).to.have.lengthOf(0);
  });

  it('shouldn\'t allow empty string', () => {
    expect(executeEnsure(ENSURE_NONEMPTY(), '')).satisfy(checkEnsureArgError(desc, ''));
  });
});