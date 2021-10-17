import { expect } from 'chai';
import { ENSURE_NOSPACES, evalStrThunk, STAGE_ISPATTERN } from '../../src';
import { runStageTesting } from '../test-util';

describe('ENSURE_NOSPACES', () => {
  const ensure = ENSURE_NOSPACES();

  it('should have it\'s default description', () => {
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('can\'t contain spaces');
  });

  it('should allow non-space string', () => {
    const { result } = runStageTesting(STAGE_ISPATTERN, ensure, 'hello');
    expect(result).to.equal(null);
  });

  it('should allow empty string', () => {
    const { result } = runStageTesting(STAGE_ISPATTERN, ensure, '');
    expect(result).to.equal(null);
  });

  it('shouldn\'t allow space string', () => {
    const { control, result } = runStageTesting(STAGE_ISPATTERN, ensure, 'hello world');
    expect(result?.field).to.equal(control.displayName);
  });
});