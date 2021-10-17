import { expect } from 'chai';
import { ENSURE_NONNULL, evalStrThunk } from '../../src';

describe('ENSURE_NONNULL', () => {
  it('should have it\'s default description', () => {
    const ensure = ENSURE_NONNULL();
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('no null value');
  });
});