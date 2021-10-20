import { expect } from 'chai';
import { ENSURE_MAXLEN, evalStrThunk, STAGE_ISPATTERN } from '../../src';
import { runStageTesting } from '../test-util';

describe('ENSURE_MAXLEN', () => {
  it('should have it\'s default description', () => {
    let desc = evalStrThunk(ENSURE_MAXLEN(5).description);
    expect(desc).to.equal('up to 5 characters');

    desc = evalStrThunk(ENSURE_MAXLEN(1).description);
    expect(desc).to.equal('up to 1 character');
  });

  const max = 5;
  const ensure = ENSURE_MAXLEN(max);
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