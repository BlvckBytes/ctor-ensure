import { expect } from 'chai';
import { ENSURE_FLOAT, evalStrThunk } from '../../../src';
import { checkEnsureArgErrors, executeEnsure } from '../../test-util';

describe('ENSURE_FLOAT', () => {
  const desc = 'floating point number';

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_FLOAT().description)).to.equal(desc);
  });

  it('should allow float number', () => {
    expect(executeEnsure(ENSURE_FLOAT(), 5.55)).to.have.lengthOf(0);
  });

  it('should allow integer number', () => {
    expect(executeEnsure(ENSURE_FLOAT(), 5)).to.have.lengthOf(0);
  });

  it('shouldn\'t allow string float', () => {
    expect(executeEnsure(ENSURE_FLOAT(), '5.55')).satisfy(checkEnsureArgErrors(desc, '5.55'));
  });

  it('shouldn\'t allow string integer', () => {
    expect(executeEnsure(ENSURE_FLOAT(), '5')).satisfy(checkEnsureArgErrors(desc, '5'));
  });

  it('shouldn\'t allow alphabetic value', () => {
    expect(executeEnsure(ENSURE_FLOAT(), 'a')).satisfy(checkEnsureArgErrors(desc, 'a'));
  });
});