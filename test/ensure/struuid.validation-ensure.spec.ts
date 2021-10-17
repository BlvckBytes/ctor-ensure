import { expect } from 'chai';
import { ENSURE_STRUUID, evalStrThunk } from '../../src';

describe('ENSURE_STRUUID', () => {
  it('should have it\'s default description', () => {
    const ensure = ENSURE_STRUUID();
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('uuid as string');
  });
});