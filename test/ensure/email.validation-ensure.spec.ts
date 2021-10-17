import { expect } from 'chai';
import { ENSURE_EMAIL, evalStrThunk } from '../../src';

describe('ENSURE_EMAIL', () => {
  const ensure = ENSURE_EMAIL();

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ensure.description)).to.equal('valid email address');
  });

  it('should allow valid e-mail address', () => {
    expect(ensure.pattern?.test('blvckbytes@gmail.com')).to.equal(true);
  });

  it('should disallow invalid e-mail address', () => {
    expect(ensure.pattern?.test('blvckbytes@gmail.')).to.equal(false);
  });
});