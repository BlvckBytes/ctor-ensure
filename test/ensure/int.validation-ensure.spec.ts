import { expect } from 'chai';
import { ENSURE_INT, evalStrThunk } from '../../src';

describe('ENSURE_INT', () => {
  it('should have it\'s default description', () => {
    const ensure = ENSURE_INT();
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('integer number');
  });
});