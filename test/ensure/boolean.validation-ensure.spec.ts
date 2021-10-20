import { expect } from 'chai';
import { ENSURE_BOOLEAN, evalStrThunk, STAGE_ISTYPE } from '../../src';
import { runStageTesting } from '../test-util';

describe('ENSURE_BOOLEAN', () => {
  const ensure = ENSURE_BOOLEAN();

  it('should have it\'s default description', () => {
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('boolean value');
  });

  it('should allow boolean value', () => {
    const value = true;

    const { result } = runStageTesting(
      STAGE_ISTYPE, ensure, value,
    );

    // No errors expected
    expect(result).to.be.null;
  });

  it('shouldn\'t allow string boolean value', () => {
    const value = 'true';

    const { control, result } = runStageTesting(
      STAGE_ISTYPE, ensure, value,
    );

    // Error expected
    expect(result?.field).to.equal(control.displayName);
  });
});