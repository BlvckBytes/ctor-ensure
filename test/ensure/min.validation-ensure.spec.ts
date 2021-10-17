import { expect } from 'chai';
import { ENSURE_MIN, evalStrThunk } from '../../src';

describe('ENSURE_MIN', () => {
  it('should have it\'s default description', () => {
    // Singular
    let ensure = ENSURE_MIN(5);
    let desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('at least 5 characters');

    // Singular
    ensure = ENSURE_MIN(1);
    desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('at least 1 character');
  });
});