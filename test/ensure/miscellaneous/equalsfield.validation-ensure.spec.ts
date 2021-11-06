import { expect } from 'chai';
import { ENSURE_EQUALSFIELD, evalDesc, pluralize, strOpt } from '../../../src';
import { checkEnsureArgErrors, executeEnsure } from '../../test-util';

describe('ENSURE_EQUALSFIELD', () => {
  const desc = (disallow = false, ...fields: string[]) => `needs to ${strOpt('not ', disallow)}equal to the ${pluralize('field', fields.length)}: ${fields.join(', ')}`;

  it('should have it\'s default description', () => {
    expect(evalDesc(ENSURE_EQUALSFIELD(true, 'a').description)).to.equal(desc(false, 'a'));
    expect(evalDesc(ENSURE_EQUALSFIELD(true, 'a', 'b').description)).to.equal(desc(false, 'a', 'b'));
  });

  it('should allow matching fields', () => {
    const value = 'hello world';
    expect(executeEnsure(ENSURE_EQUALSFIELD(true, 'a', 'b', 'c'), value, {
      a: value, b: value, c: value,
    })).to.have.lengthOf(0);
  });

  it('should disallow forbidden fields', () => {
    const value = 'hello world';
    expect(executeEnsure(ENSURE_EQUALSFIELD(false, 'a', 'b', 'c'), value, {
      a: value, b: value, c: value,
    })).satisfy(checkEnsureArgErrors(desc(true, 'a', 'b', 'c'), value));
  });

  it('shouldn\'t allow differing fields', () => {
    const value = 'hello world';
    const valueDifferent = 'bye world';
    expect(executeEnsure(ENSURE_EQUALSFIELD(true, 'a', 'b', 'c'), valueDifferent, {
      a: value, b: value, c: value,
    })).to.satisfy(checkEnsureArgErrors(desc(false, 'a', 'b', 'c'), valueDifferent));
  });

  it('should throw on unknown field', () => {
    expect(() => executeEnsure(ENSURE_EQUALSFIELD(true, 'unknown'), '')).to.throw('Unknown field requested!');
  });
});