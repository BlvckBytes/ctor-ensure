import { expect } from 'chai';
import { ENSURE_PATTERN, evalStrThunk } from '../../src';

describe('ENSURE_PATTERN', () => {
  it('should pass through it\'s description', () => {
    const ensure = ENSURE_PATTERN(/any/, 'this is a description');
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('this is a description');
  });
});