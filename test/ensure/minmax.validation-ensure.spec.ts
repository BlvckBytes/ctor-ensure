import { expect } from 'chai';
import { ENSURE_MINMAX, evalStrThunk, STAGE_ISPATTERN } from '../../src';
import { runStageTesting } from '../test-util';

describe('ENSURE_MINMAX', () => {
  it('should have it\'s default description', () => {
    // Plural lower, no upper
    let ensure = ENSURE_MINMAX(5, -1);
    let desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('at least 5 characters');

    // Singular lower, no upper
    ensure = ENSURE_MINMAX(1, -1);
    desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('at least 1 character');

    // Singular lower, singular upper
    ensure = ENSURE_MINMAX(1, 1);
    desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('at least 1 character and up to 1 character');

    // Plural lower, plural upper
    ensure = ENSURE_MINMAX(2, 3);
    desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('at least 2 characters and up to 3 characters');

    // no lower, singular upper
    ensure = ENSURE_MINMAX(-1, 1);
    desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('up to 1 character');

    // no lower, plural upper
    ensure = ENSURE_MINMAX(-1, 3);
    desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('up to 3 characters');
  });

  const min = 5;
  const max = 10;
  const ensure = ENSURE_MINMAX(min, max);
  it('should allow value with length of range', () => {
    let { result } = runStageTesting(STAGE_ISPATTERN, ensure, 'X'.repeat(min));
    expect(result).to.equal(null);

    result = runStageTesting(STAGE_ISPATTERN, ensure, 'X'.repeat(max)).result;
    expect(result).to.equal(null);
  });

  it('shouldn\'t allow less than min characters', () => {
    const { control, result } = runStageTesting(STAGE_ISPATTERN, ensure, 'X'.repeat(min - 1));
    expect(result?.field).to.equal(control.displayName);
  });

  it('shouldn\'t allow more than max characters', () => {
    const { control, result } = runStageTesting(STAGE_ISPATTERN, ensure, 'X'.repeat(max + 1));
    expect(result?.field).to.equal(control.displayName);
  });
});