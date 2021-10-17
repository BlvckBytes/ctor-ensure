import { expect } from 'chai';
import { ENSURE_NOSPACES, evalStrThunk } from '../../src';

describe('ENSURE_NOSPACES', () => {
  const ensure = ENSURE_NOSPACES();

  it('should have it\'s default description', () => {
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('can\'t contain spaces');
  });

  it('should allow empty strings', () => {
    expect(ensure.pattern?.test('')).to.equal(true);
  });

  it('should allow non-space strings', () => {
    expect(ensure.pattern?.test('helloworld')).to.equal(true);
  });

  it('should disallow spaces in strings', () => {
    expect(ensure.pattern?.test('hello world')).to.equal(true);
  });
});