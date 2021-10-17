import { expect } from 'chai';
import { ENSURE_EXISTING, evalStrThunk } from '../../src';

describe('ENSURE_EXISTING', () => {
  it('should have it\'s default description', () => {
    const ensure = ENSURE_EXISTING();
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('mandatory field');
  });
});