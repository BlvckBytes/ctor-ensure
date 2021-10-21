import { expect } from 'chai';
import { ENSURE_MINLEN, evalStrThunk, pluralize } from '../../src';
import { checkEnsureArgError, executeEnsure } from '../test-util';

describe('ENSURE_MINLEN', () => {
  const desc = (min: number) => `at least ${min} ${pluralize('character', min)}`;

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_MINLEN(5).description)).equal(desc(5));
    expect(evalStrThunk(ENSURE_MINLEN(1).description)).equal(desc(1));
  });

  it('should allow more than min characters', () => {
    for (let i = 5; i <= 10; i += 1)
      expect(executeEnsure(ENSURE_MINLEN(5), 'X'.repeat(i))).to.have.lengthOf(0);
  });

  it('shouldn\'t allow less than min characters', () => {
    for (let i = 0; i < 5; i += 1)
      expect(executeEnsure(ENSURE_MINLEN(5), 'X'.repeat(i))).satisfy(checkEnsureArgError(desc(5), 'X'.repeat(i)));
  });
});