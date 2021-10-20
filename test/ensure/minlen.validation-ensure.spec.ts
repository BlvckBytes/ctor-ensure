import { expect } from 'chai';
import { ENSURE_MINLEN, evalStrThunk, STAGE_ISPATTERN } from '../../src';
import { runStageTesting } from '../test-util';

describe('ENSURE_MINLEN', () => {
  it('should have it\'s default description', () => {
    let desc = evalStrThunk(ENSURE_MINLEN(5).description);
    expect(desc).to.equal('at least 5 characters');

    desc = evalStrThunk(ENSURE_MINLEN(1).description);
    expect(desc).to.equal('at least 1 character');
  });

  const min = 5;
  const ensure = ENSURE_MINLEN(min);
  it('should allow more down to min characters', () => {
    let { result } = runStageTesting(STAGE_ISPATTERN, ensure, 'X'.repeat(min));
    expect(result).to.be.null;

    result = runStageTesting(STAGE_ISPATTERN, ensure, 'X'.repeat(min * 5)).result;
    expect(result).to.be.null;
  });

  it('shouldn\'t allow less than min characters', () => {
    const { control, result } = runStageTesting(STAGE_ISPATTERN, ensure, 'X'.repeat(min - 1));
    expect(result?.field).to.equal(control.displayName);
  });
});