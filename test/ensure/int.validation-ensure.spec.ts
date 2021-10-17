import { expect } from 'chai';
import { ENSURE_INT, evalStrThunk, STAGE_ISTYPE } from '../../src';
import { runStageTesting } from '../test-util';

describe('ENSURE_INT', () => {
  const ensure = ENSURE_INT();

  it('should have it\'s default description', () => {
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('integer number');
  });

  it('should allow integer value', () => {
    const value = 55;

    const { result } = runStageTesting(
      STAGE_ISTYPE, ensure, value,
    );

    // No errors expected
    expect(result).to.equal(null);
  });

  it('shouldn\'t allow string integer value', () => {
    const value = '55';

    const { control, result } = runStageTesting(
      STAGE_ISTYPE, ensure, value,
    );

    // Error expected
    expect(result?.field).to.equal(control.displayName);
  });

  it('shouldn\'t allow alphabetic value', () => {
    const value = 'hello world';

    const { control, result } = runStageTesting(
      STAGE_ISTYPE, ensure, value,
    );

    // Error expected
    expect(result?.field).to.equal(control.displayName);
  });
});