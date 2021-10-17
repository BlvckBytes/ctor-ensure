import { expect } from 'chai';
import { ENSURE_STRFLOAT, evalStrThunk } from '../../src';

describe('ENSURE_STRFLOAT', () => {
  it('should have it\'s default description', () => {
    const ensure = ENSURE_STRFLOAT();
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('floating point number as string');
  });
});