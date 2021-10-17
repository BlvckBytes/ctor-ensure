import { expect } from 'chai';
import { ENSURE_FLOAT, evalStrThunk } from '../../src';

describe('ENSURE_FLOAT', () => {
  it('should have it\'s default description', () => {
    const ensure = ENSURE_FLOAT();
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('floating point number');
  });
});