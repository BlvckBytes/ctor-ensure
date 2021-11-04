import { expect } from 'chai';
import { CtorEnsure, CtorEnsureException } from '../src';
import { genModelName } from './test-util';

describe('new CtorEnsureException()', () => {
  it('should fetch the class\' display-name correctly', () => {

    const displayname = genModelName();
    @CtorEnsure({ displayname })
    class TestClass {}

    // Construct a new exception targetting the test class
    const exception = new CtorEnsureException(TestClass, []);

    // Should have extracted the displayname properly
    expect(exception.displayName).to.equal(displayname);
    expect(exception).instanceOf(CtorEnsureException);
    expect(exception.message).to.equal(CtorEnsureException.message);
  });
});