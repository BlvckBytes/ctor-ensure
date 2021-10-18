import { expect } from 'chai';
import { ENSURE_FLOAT, evalStrThunk, STAGE_ISTYPE } from '../../src';
import { runStageTesting } from '../test-util';

describe('ENSURE_FLOAT', () => {
  const ensure = ENSURE_FLOAT();

  it('should have it\'s default description', () => {
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('floating point number');
  });

  it('should allow float number', () => {
    const value = 55.555;

    const { result } = runStageTesting(
      STAGE_ISTYPE, ensure, value,
    );

    // No errors expected
    expect(result).to.be.null;
  });

  it('should allow integer number', () => {
    const value = 55;

    const { result } = runStageTesting(
      STAGE_ISTYPE, ensure, value,
    );

    // No errors expected
    expect(result).to.be.null;
  });

  it('shouldn\'t allow string float', () => {
    const value = '55.555';

    const { control, result } = runStageTesting(
      STAGE_ISTYPE, ensure, value,
    );

    // Error expected
    expect(result?.field).to.equal(control.displayName);
  });

  it('shouldn\'t allow alphabetical value', () => {
    const value = 'hello world';

    const { control, result } = runStageTesting(
      STAGE_ISTYPE, ensure, value,
    );

    // Error expected
    expect(result?.field).to.equal(control.displayName);
  });
});