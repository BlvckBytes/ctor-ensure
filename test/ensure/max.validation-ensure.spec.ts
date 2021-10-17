import { expect } from 'chai';
import { ENSURE_MAX, evalStrThunk } from '../../src';

describe('ENSURE_MAX', () => {
  it('should have it\'s default description', () => {
    // Singular
    let ensure = ENSURE_MAX(5);
    let desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('up to 5 characters');

    // Singular
    ensure = ENSURE_MAX(1);
    desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('up to 1 character');
  });
});