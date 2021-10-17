import { expect } from 'chai';
import { ENSURE_NONEMPTY, evalStrThunk } from '../../src';

describe('ENSURE_NONEMPTY', () => {
  it('should have it\'s default description', () => {
    const ensure = ENSURE_NONEMPTY();
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('no empty value');
  });
});