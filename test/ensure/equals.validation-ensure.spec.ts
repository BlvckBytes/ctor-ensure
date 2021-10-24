import { expect } from 'chai';
import { ENSURE_EQUALS, evalStrThunk } from '../../src';
import { checkEnsureArgErrors, executeEnsure } from '../test-util';

describe('ENSURE_EQUALS', () => {
  const desc = (field: string) => `needs to equal to the field: ${field}`;
  const descPlural = (...fields: string[]) => `needs to equal to the fields: ${fields.join(', ')}`;

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_EQUALS('a').description)).to.equal(desc('a'));
    expect(evalStrThunk(ENSURE_EQUALS('a', 'b').description)).to.equal(descPlural('a', 'b'));
  });

  it('should allow matching fields', () => {
    const value = 'hello world';
    expect(executeEnsure(ENSURE_EQUALS('a', 'b', 'c'), value, {
      a: value, b: value, c: value,
    })).to.have.lengthOf(0);
  });

  it('shouldn\'t allow differing fields', () => {
    const value = 'hello world';
    const valueDifferent = 'bye world';
    expect(executeEnsure(ENSURE_EQUALS('a', 'b', 'c'), valueDifferent, {
      a: value, b: value, c: value,
    })).to.satisfy(checkEnsureArgErrors(descPlural('a', 'b', 'c'), valueDifferent));
  });

  it('should throw on unknown field', () => {
    expect(() => executeEnsure(ENSURE_EQUALS('unknown'), '')).to.throw('Unknown field requested!');
  });
});