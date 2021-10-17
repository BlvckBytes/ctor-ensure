import { expect } from 'chai';
import { ENSURE_MINMAX, evalStrThunk } from '../../src';

describe('ENSURE_MINMAX', () => {
  it('should have it\'s default description', () => {
    // Plural lower, no upper
    let ensure = ENSURE_MINMAX(5, -1);
    let desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('at least 5 characters');

    // Singular lower, no upper
    ensure = ENSURE_MINMAX(1, -1);
    desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('at least 1 character');

    // Singular lower, singular upper
    ensure = ENSURE_MINMAX(1, 1);
    desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('at least 1 character and up to 1 character');

    // Plural lower, plural upper
    ensure = ENSURE_MINMAX(2, 3);
    desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('at least 2 characters and up to 3 characters');

    // no lower, singular upper
    ensure = ENSURE_MINMAX(-1, 1);
    desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('up to 1 character');

    // no lower, plural upper
    ensure = ENSURE_MINMAX(-1, 3);
    desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('up to 3 characters');
  });
});