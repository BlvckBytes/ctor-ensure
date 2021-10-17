import { expect } from 'chai';
import { ENSURE_STRUUID, evalStrThunk, STAGE_ISPATTERN, STAGE_ISTYPE } from '../../src';
import { runStageTesting } from '../test-util';

describe('ENSURE_STRUUID', () => {
  const ensure = ENSURE_STRUUID();
  const stages = [STAGE_ISPATTERN, STAGE_ISTYPE];

  it('should have it\'s default description', () => {
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('uuid as string');
  });

  it('should allow string uuid', () => {
    const { result } = runStageTesting(stages, ensure, 'A5D8A2A2-C3BD-46AD-AFCC-9223B0078209');
    expect(result).to.equal(null);
  });

  it('shouldn\'t allow invalid uuid', () => {
    const { control, result } = runStageTesting(stages, ensure, 'A5D8A2A2-C3BD-9223B0078209');
    expect(result?.field).to.equal(control.displayName);
  });
});