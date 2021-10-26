import { expect } from 'chai';
import { ENSURE_MAXLEN, evalStrThunk, pluralize } from '../../../src';
import { checkEnsureArgErrors, executeEnsure } from '../../test-util';

describe('ENSURE_MAXLEN', () => {
  const desc = (max: number) => `up to ${max} ${pluralize('character', max)}`;

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_MAXLEN(5).description)).to.equal(desc(5));
    expect(evalStrThunk(ENSURE_MAXLEN(1).description)).to.equal(desc(1));
  });

  it('should allow 0 to max characters', () => {
    for (let i = 0; i <= 5; i += 1)
      expect(executeEnsure(ENSURE_MAXLEN(5), 'X'.repeat(i))).have.lengthOf(0);
  });

  it('shouldn\'t allow more than max characters', () => {
    expect(executeEnsure(ENSURE_MAXLEN(5), 'X'.repeat(6))).satisfy(checkEnsureArgErrors(desc(5), 'X'.repeat(6)));
  });
});