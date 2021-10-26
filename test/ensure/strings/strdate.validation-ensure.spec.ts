import { expect } from 'chai';
import { ENSURE_STRDATE, evalStrThunk } from '../../../src';
import { checkEnsureArgErrors, executeEnsure } from '../../test-util';

describe('ENSURE_STRDATE', () => {
  const desc = 'valid full ISO-8601 datetime string';

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_STRDATE().description)).to.equal(desc);
  });

  it('should allow valid date', () => {
    expect(executeEnsure(ENSURE_STRDATE(), '2021-10-17T17:38:50+00:00')).to.have.lengthOf(0);
  });

  it('should allow empty string', () => {
    expect(executeEnsure(ENSURE_STRDATE(), '')).to.have.lengthOf(0);
  });

  it('shouldn\'t allow invalid date', () => {
    expect(executeEnsure(ENSURE_STRDATE(), '2020-03-05')).satisfy(checkEnsureArgErrors(desc, '2020-03-05'));
  });
});