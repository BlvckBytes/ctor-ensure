import { expect } from 'chai';
import { ENSURE_STRFLOAT, evalStrThunk } from '../../src';
import { checkEnsureArgErrors, executeEnsure } from '../test-util';

describe('ENSURE_STRFLOAT', () => {
  const desc = 'floating point number as string';

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_STRFLOAT().description)).to.equal(desc);
  });

  it('should allow string float', () => {
    expect(executeEnsure(ENSURE_STRFLOAT(), '55.55')).to.have.lengthOf(0);
  });

  it('should allow empty values', () => {
    expect(executeEnsure(ENSURE_STRFLOAT(), '')).to.have.lengthOf(0);
  });

  it('shouldn\'t allow string int', () => {
    expect(executeEnsure(ENSURE_STRFLOAT(), '5')).satisfy(checkEnsureArgErrors(desc, '5'));
  });

  it('shouldn\'t allow number int', () => {
    expect(executeEnsure(ENSURE_STRFLOAT(), 5)).satisfy(checkEnsureArgErrors(desc, 5));
  });

  it('shouldn\'t allow number float', () => {
    expect(executeEnsure(ENSURE_STRFLOAT(), 5.5)).satisfy(checkEnsureArgErrors(desc, 5.5));
  });
});