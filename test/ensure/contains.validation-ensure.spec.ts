import { expect } from 'chai';
import { ENSURE_CONTAINS, evalStrThunk } from '../../src';

describe('ENSURE_CONTAINS', () => {
  const ensure = ENSURE_CONTAINS('this is a test');

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ensure.description)).to.equal('needs to contain: this is a test');
  });

  it('should allow containing string', () => {
    expect(ensure.pattern?.test('contains this is a test')).to.equal(true);
  });

  it('should disallow containing string', () => {
    expect(ensure.pattern?.test('doesn\'t contain it')).to.equal(false);
  });
});