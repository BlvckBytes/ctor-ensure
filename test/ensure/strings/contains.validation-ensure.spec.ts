import { expect } from 'chai';
import { ENSURE_CONTAINS, evalStrThunk } from '../../../src';
import { checkEnsureArgErrors, executeEnsure } from '../../test-util';

describe('ENSURE_CONTAINS', () => {
  const contains = 'this is a test';
  const nonContains = 'different string';
  const desc = `needs to contain: ${contains}`;
  const descNegated = `doesn't contain: ${contains}`;

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_CONTAINS(contains).description)).to.equal(desc);
    expect(evalStrThunk(ENSURE_CONTAINS(contains, false).description)).to.equal(descNegated);
  });

  it('should allow containing string', () => {
    expect(executeEnsure(ENSURE_CONTAINS(contains), contains)).to.have.lengthOf(0);
  });

  it('should disallow containing string', () => {
    expect(executeEnsure(ENSURE_CONTAINS(contains, false), contains)).satisfies(checkEnsureArgErrors(descNegated, contains));
    expect(executeEnsure(ENSURE_CONTAINS(contains, false), nonContains)).to.have.lengthOf(0);
  });

  it('should disallow non-containing string', () => {
    expect(executeEnsure(ENSURE_CONTAINS(contains), nonContains)).satisfies(checkEnsureArgErrors(desc, nonContains));
  });
});