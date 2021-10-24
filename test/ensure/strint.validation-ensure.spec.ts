import { expect } from 'chai';
import { ENSURE_STRINT, evalStrThunk } from '../../src';
import { checkEnsureArgErrors, executeEnsure } from '../test-util';

describe('ENSURE_STRINT', () => {
  const desc = 'integer number as string';

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ENSURE_STRINT().description)).to.equal(desc);
  });

  it('should allow string int', () => {
    expect(executeEnsure(ENSURE_STRINT(), '5')).to.have.lengthOf(0);
  });

  it('should allow empty string', () => {
    expect(executeEnsure(ENSURE_STRINT(), '')).to.have.lengthOf(0);
  });

  it('shouldn\'t allow string float', () => {
    expect(executeEnsure(ENSURE_STRINT(), '55.55')).satisfy(checkEnsureArgErrors(desc, '55.55'));
  });

  it('shouldn\'t allow number int', () => {
    expect(executeEnsure(ENSURE_STRINT(), 5)).satisfy(checkEnsureArgErrors(desc, 5));
  });
});