import { expect } from 'chai';
import { ENSURE_EQUALS, evalStrThunk } from '../../src';

describe('ENSURE_EQUALS', () => {
  it('should have it\'s default description', () => {
    // Plural
    let ensure = ENSURE_EQUALS('a', 'b', 'test');
    let desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('needs to equal to the fields: a, b, test');

    // Singular
    ensure = ENSURE_EQUALS('a');
    desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('needs to equal to the field: a');
  });
});