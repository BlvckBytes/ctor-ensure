import { expect } from 'chai';
import { ENSURE_STRDATE, evalStrThunk, STAGE_ISPATTERN } from '../../src';
import { runStageTesting } from '../test-util';

describe('ENSURE_STRDATE', () => {
  const ensure = ENSURE_STRDATE();

  it('should have it\'s default description', () => {
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('valid full ISO-8601 datetime string');
  });

  it('should allow valid date', () => {
    const { result } = runStageTesting(STAGE_ISPATTERN, ensure, '2021-10-17T17:38:50+00:00');
    expect(result).to.be.null;
  });

  it('should allow empty string', () => {
    const { result } = runStageTesting(STAGE_ISPATTERN, ensure, '');
    expect(result).to.be.null;
  });

  it('shouldn\'t allow invalid date', () => {
    const { control, result } = runStageTesting(STAGE_ISPATTERN, ensure, '2021-10-17');
    expect(result?.field).to.equal(control.displayName);
  });
});