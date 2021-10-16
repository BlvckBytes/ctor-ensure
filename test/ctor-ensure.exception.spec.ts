import { expect } from 'chai';
import { CtorEnsure, CtorEnsureException } from '../src';

describe('new CtorEnsureException()', () => {
  it('should fetch the class\' display-name correctly', () => {
    @CtorEnsure('test-model')
    class TestClass {}

    // Construct a new exception targetting the test class
    const exception = new CtorEnsureException(TestClass, []);

    // Should have extracted the displayname properly
    expect(exception.displayName).to.equal('test-model');
  });
});