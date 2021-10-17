import { expect } from 'chai';
import { ENSURE_STRDATE, evalStrThunk } from '../../src';

describe('ENSURE_STRDATE', () => {
  it('should have it\'s default description', () => {
    const ensure = ENSURE_STRDATE();
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('valid full ISO-8601 datetime string');
  });
});