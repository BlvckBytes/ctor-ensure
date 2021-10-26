import { expect } from 'chai';
import { ENSURE_INT, evalStrThunk } from '../../../src';
import { checkEnsureArgErrors, executeEnsure } from '../../test-util';

describe('ENSURE_INT', () => {
  const desc = 'integer number';

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_INT().description)).to.equal(desc);
  });

  it('should allow integer value', () => {
    expect(executeEnsure(ENSURE_INT(), 5)).to.have.lengthOf(0);
  });

  it('shouldn\'t allow string integer value', () => {
    expect(executeEnsure(ENSURE_INT(), '5')).satisfy(checkEnsureArgErrors(desc, '5'));
  });

  it('shouldn\'t allow alphabetic value', () => {
    expect(executeEnsure(ENSURE_INT(), 'a')).satisfy(checkEnsureArgErrors(desc, 'a'));
  });
});