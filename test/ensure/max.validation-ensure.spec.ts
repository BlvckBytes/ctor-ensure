import { expect } from 'chai';
import { ENSURE_MAX, evalStrThunk, STAGE_ISPATTERN } from '../../src';
import { runStageTesting } from '../test-util';

describe('ENSURE_MAX', () => {
  it('should have it\'s default description', () => {
    let desc = evalStrThunk(ENSURE_MAX(5).description);
    expect(desc).to.equal('up to 5 characters');

    desc = evalStrThunk(ENSURE_MAX(1).description);
    expect(desc).to.equal('up to 1 character');
  });

  const max = 5;
  const ensure = ENSURE_MAX(max);
  it('should allow 0 to max characters', () => {
    let { result } = runStageTesting(STAGE_ISPATTERN, ensure, 'X'.repeat(max));
    expect(result).to.be.null;

    result = runStageTesting(STAGE_ISPATTERN, ensure, '').result;
    expect(result).to.be.null;
  });

  it('shouldn\'t allow more than max characters', () => {
    const { control, result } = runStageTesting(STAGE_ISPATTERN, ensure, 'X'.repeat(max + 1));
    expect(result?.field).to.equal(control.displayName);
  });
});