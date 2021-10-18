import { expect } from 'chai';
import { ENSURE_EXISTING, evalStrThunk, STAGE_ISTYPE } from '../../src';
import { runStageTesting } from '../test-util';

describe('ENSURE_EXISTING', () => {
  const ensure = ENSURE_EXISTING();

  it('should have it\'s default description', () => {
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('mandatory field');
  });

  it('should allow defined fields', () => {
    const value = 'i am defined';

    const { result } = runStageTesting(
      STAGE_ISTYPE, ensure, value,
    );

    // No errors expected
    expect(result).to.be.null;
  });

  it('shouldn\'t allow undefined fields', () => {
    const value = undefined;

    const { result, control } = runStageTesting(
      STAGE_ISTYPE, ensure, value,
    );

    // Error should occur
    expect(result?.field).to.equal(control.displayName);
  });
});