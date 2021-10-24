
import { expect } from 'chai';
import { ENSURE_ARRAYSIZEMAX, evalStrThunk, pluralize } from '../../src';
import { checkEnsureArgErrors, executeEnsure } from '../test-util';

describe('ENSURE_ARRAYSIZEMAX', () => {
  const desc = (max: number) => `up to ${max} array ${pluralize('element', max)}`;

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_ARRAYSIZEMAX(5).description)).to.equal(desc(5));
    expect(evalStrThunk(ENSURE_ARRAYSIZEMAX(1).description)).to.equal(desc(1));
  });

  it('should allow 0 to max elements', () => {
    for (let i = 0; i <= 5; i += 1)
      expect(executeEnsure(ENSURE_ARRAYSIZEMAX(5), Array(i).fill(0))).have.lengthOf(0);
  });

  it('shouldn\'t allow more than max elements', () => {
    const val = Array(6).fill(0);
    expect(executeEnsure(ENSURE_ARRAYSIZEMAX(5), val)).satisfy(checkEnsureArgErrors(desc(5), val));
  });
});