import { expect } from 'chai';
import { ENSURE_STRINT, evalStrThunk } from '../../src';

describe('ENSURE_STRINT', () => {
  it('should have it\'s default description', () => {
    const ensure = ENSURE_STRINT();
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('integer number as string');
  });
});