import { expect } from 'chai';
import { ENSURE_NONEMPTY, evalStrThunk, STAGE_ISPATTERN } from '../../src';
import { runStageTesting } from '../test-util';

describe('ENSURE_NONEMPTY', () => {
  it('should have it\'s default description', () => {
    const ensure = ENSURE_NONEMPTY();
    const desc = evalStrThunk(ensure.description);
    expect(desc).to.equal('no empty value');
  });

  const ensure = ENSURE_NONEMPTY();
  it('should allow non-empty string', () => {
    const { result } = runStageTesting(STAGE_ISPATTERN, ensure, 'hello world');
    expect(result).to.be.null;
  });

  it('shouldn\'t allow empty string', () => {
    const { control, result } = runStageTesting(STAGE_ISPATTERN, ensure, '');
    expect(result?.field).to.equal(control.displayName);
  });
});