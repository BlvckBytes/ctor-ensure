import { expect } from 'chai';
import { ENSURE_MINMAXLEN, evalStrThunk, STAGE_ISPATTERN } from '../../src';
import { runStageTesting } from '../test-util';

describe('ENSURE_MINMAXLEN', () => {
  it('should have it\'s default description', () => {
    // Plural lower, no upper
    let desc = evalStrThunk(ENSURE_MINMAXLEN(5, -1).description);
    expect(desc).to.equal('at least 5 characters');

    // Singular lower, no upper
    desc = evalStrThunk(ENSURE_MINMAXLEN(1, -1).description);
    expect(desc).to.equal('at least 1 character');

    // Singular lower, singular upper
    desc = evalStrThunk(ENSURE_MINMAXLEN(1, 1).description);
    expect(desc).to.equal('at least 1 character and up to 1 character');

    // Plural lower, plural upper
    desc = evalStrThunk(ENSURE_MINMAXLEN(2, 3).description);
    expect(desc).to.equal('at least 2 characters and up to 3 characters');

    // no lower, singular upper
    desc = evalStrThunk(ENSURE_MINMAXLEN(-1, 1).description);
    expect(desc).to.equal('up to 1 character');

    // no lower, plural upper
    desc = evalStrThunk(ENSURE_MINMAXLEN(-1, 3).description);
    expect(desc).to.equal('up to 3 characters');
  });

  const min = 5;
  const max = 10;
  const ensure = ENSURE_MINMAXLEN(min, max);
  it('should allow value with length of range', () => {
    let { result } = runStageTesting(STAGE_ISPATTERN, ensure, 'X'.repeat(min));
    expect(result).to.be.null;

    result = runStageTesting(STAGE_ISPATTERN, ensure, 'X'.repeat(max)).result;
    expect(result).to.be.null;
  });

  it('shouldn\'t allow less than min characters', () => {
    const { control, result } = runStageTesting(STAGE_ISPATTERN, ensure, 'X'.repeat(min - 1));
    expect(result?.field).to.equal(control.displayName);
  });

  it('shouldn\'t allow more than max characters', () => {
    const { control, result } = runStageTesting(STAGE_ISPATTERN, ensure, 'X'.repeat(max + 1));
    expect(result?.field).to.equal(control.displayName);
  });

  it('shouldn\'t accept smaller max than min', () => {
    const call = () => runStageTesting(STAGE_ISPATTERN, ENSURE_MINMAXLEN(10, 5), '');
    expect(call).to.throw('Max cannot be less than min!');
  });

  it('shouldn\'t accept both bounds at -1', () => {
    const call = () => runStageTesting(STAGE_ISPATTERN, ENSURE_MINMAXLEN(-1, -1), '');
    expect(call).to.throw('Define at least min or max!');
  });
});