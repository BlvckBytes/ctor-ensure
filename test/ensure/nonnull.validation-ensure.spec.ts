import { expect } from 'chai';
import { ENSURE_NONNULL, evalStrThunk, STAGE_ISTYPE } from '../../src';
import { runStageTesting } from '../test-util';

describe('ENSURE_NONNULL', () => {
  const ensure = ENSURE_NONNULL();

  it('should have it\'s default description', () => {
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('no null value');
  });

  it('should allow non-null fields', () => {
    const value = 'i am not null';

    const { result } = runStageTesting(
      STAGE_ISTYPE, ensure, value,
    );

    // No errors expected
    expect(result).to.be.null;
  });

  it('shouldn\'t allow undefined fields', () => {
    const value = undefined;

    const { control, result } = runStageTesting(
      STAGE_ISTYPE, ensure, value,
    );

    // Error should occur
    expect(result?.field).to.equal(control.displayName);
  });

  it('shouldn\'t allow null fields', () => {
    const value = null;

    const { control, result } = runStageTesting(
      STAGE_ISTYPE, ensure, value,
    );

    // Error should occur
    expect(result?.field).to.equal(control.displayName);
 
  });
});