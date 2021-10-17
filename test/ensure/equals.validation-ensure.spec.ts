import { expect } from 'chai';
import { ENSURE_EQUALS, evalStrThunk } from '../../src';

describe('ENSURE_EQUALS', () => {
  it('should have it\'s default description', () => {
    // Plural
    let fields = ['a', 'b', 'test'];
    let ensure = ENSURE_EQUALS(...fields);
    let desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('needs to equal to the fields: a, b, test');
    expect(ensure.equalsToFields).to.deep.equal(fields);

    // Singular
    fields = ['a'];
    ensure = ENSURE_EQUALS(...fields);
    desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('needs to equal to the field: a');
    expect(ensure.equalsToFields).to.deep.equal(fields);
  });
});