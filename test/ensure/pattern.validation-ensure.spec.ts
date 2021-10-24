import { expect } from 'chai';
import { ENSURE_PATTERN, evalStrThunk } from '../../src';
import { checkEnsureArgErrors, executeEnsure } from '../test-util';

describe('ENSURE_PATTERN', () => {
  it('should pass through it\'s description', () => {
    expect(evalStrThunk(ENSURE_PATTERN(/a/, 'this is a test').description)).to.equal('this is a test');
  });

  const alphaDesc = 'Only the alphabet with spaces';
  const alphaEnsure = ENSURE_PATTERN(/^[A-Za-z ]+/, alphaDesc);

  it('should allow it\'s pattern', () => {
    expect(executeEnsure(alphaEnsure, 'Hello World')).to.have.lengthOf(0);
  });

  it('should deny a foreign pattern', () => {
    expect(executeEnsure(alphaEnsure, '0123456789')).satisfy(checkEnsureArgErrors(alphaDesc, '0123456789'));
  });
});