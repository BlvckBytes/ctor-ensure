import { expect } from 'chai';
import { ENSURE_EMAIL, evalStrThunk } from '../../../src';
import { checkEnsureArgErrors, executeEnsure } from '../../test-util';

describe('ENSURE_EMAIL', () => {
  const validEmail = 'blvckbytes@gmail.com';
  const invalidEmail = 'blvckbytes@gmail.';
  const desc = 'valid email address';

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_EMAIL().description)).to.equal(desc);
  });

  it('should allow valid e-mail address', () => {
    expect(executeEnsure(ENSURE_EMAIL(), validEmail)).to.have.lengthOf(0);
  });

  it('should disallow invalid e-mail address', () => {
    expect(executeEnsure(ENSURE_EMAIL(), invalidEmail)).satisfies(checkEnsureArgErrors(desc, invalidEmail));
  });
});