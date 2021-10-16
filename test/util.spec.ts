import { expect } from 'chai';
import { strOpt } from '../src';

describe('strOpt()', () => {
  it('string should be rendered if condition is true', () => {
    // Condition is true, string should be passed through
    expect(strOpt('test', true)).to.equal('test');
  });

  it('string should not be rendered if condition is false', () => {
    // Condition is false, string should be empty
    expect(strOpt('test', false)).to.be.empty;
  });
});