import { expect } from 'chai';
import { ENSURE_STRFLOAT, evalStrThunk, STAGE_ISPATTERN, STAGE_ISTYPE } from '../../src';
import { runStageTesting } from '../test-util';

describe('ENSURE_STRFLOAT', () => {
  const ensure = ENSURE_STRFLOAT();
  const stages = [STAGE_ISPATTERN, STAGE_ISTYPE];

  it('should have it\'s default description', () => {
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('floating point number as string');
  });

  it('should allow string float', () => {
    const { result } = runStageTesting(stages, ensure, '45.43');
    expect(result).to.be.null;
  });

  it('should allow empty values', () => {
    const { result } = runStageTesting(stages, ensure, '');
    expect(result).to.be.null;
  });

  it('shouldn\'t allow string int', () => {
    const { control, result } = runStageTesting(stages, ensure, '122');
    expect(result?.field).to.equal(control.displayName);
  });

  it('shouldn\'t allow number float', () => {
    const { control, result } = runStageTesting(stages, ensure, 45.43);
    expect(result?.field).to.equal(control.displayName);
  });
});