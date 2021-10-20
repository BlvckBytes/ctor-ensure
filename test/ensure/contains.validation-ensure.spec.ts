import { expect } from 'chai';
import { ENSURE_CONTAINS, evalStrThunk, STAGE_ISPATTERN } from '../../src';
import { runStageTesting } from '../test-util';

describe('ENSURE_CONTAINS', () => {
  const ensure = ENSURE_CONTAINS('this is a test');

  it('should have it\'s default description', () => {
    expect(evalStrThunk(ensure.description)).to.equal('needs to contain: this is a test');
  });

  it('should allow containing string', () => {
    const { result } = runStageTesting(STAGE_ISPATTERN, ensure, 'this is a test');
    expect(result).to.be.null;
  });

  it('should disallow containing string', () => {
    const { result, control } = runStageTesting(STAGE_ISPATTERN, ENSURE_CONTAINS('this is a test', false), 'this is a test');
    expect(result?.field).to.equal(control.displayName);

    const { result: result2 } = runStageTesting(STAGE_ISPATTERN, ENSURE_CONTAINS('this is a test', false), 'this is a trial');
    expect(result2).to.be.null;
  });

  it('should disallow non-containing string', () => {
    const { result, control } = runStageTesting(STAGE_ISPATTERN, ensure, 'doesn\'t contain it');
    expect(result?.field).to.equal(control.displayName);
  });
});