import { expect } from 'chai';
import { ENSURE_STRINT, evalStrThunk, STAGE_ISPATTERN, STAGE_ISTYPE } from '../../src';
import { runStageTesting } from '../test-util';

describe('ENSURE_STRINT', () => {
  const ensure = ENSURE_STRINT();
  const stages = [STAGE_ISPATTERN, STAGE_ISTYPE];

  it('should have it\'s default description', () => {
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('integer number as string');
  });

  it('should allow string int', () => {
    const { result } = runStageTesting(stages, ensure, '45');
    expect(result).to.be.null;
  });

  it('shouldn\'t allow string float', () => {
    const { control, result } = runStageTesting(stages, ensure, '45.54');
    expect(result?.field).to.equal(control.displayName);
  });

  it('shouldn\'t allow number int', () => {
    const { control, result } = runStageTesting(stages, ensure, 45);
    expect(result?.field).to.equal(control.displayName);
  });
});