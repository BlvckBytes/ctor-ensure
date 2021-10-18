import { expect } from 'chai';
import { STAGE_ISARRAY } from '../../src';
import { runStageTesting } from '../test-util';

describe('STAGE_ISARRAY', () => {
  it('should allow array value', () => {
    // Invoke with array type
    const { result } = runStageTesting(STAGE_ISARRAY, {
      description: '',
    }, [5], { isArray: true });

    expect(result).to.equal(null);
  });

  it('shouldn\'t allow scalar value', () => {
    // Invoke with scalar type
    const { control, result } = runStageTesting(STAGE_ISARRAY, {
      description: '',
    }, 5, { isArray: true });

    expect(result?.field).to.equal(control.displayName);
  });

  it('shouldn\'t allow array value', () => {
    // Invoke with scalar type
    const { control, result } = runStageTesting(STAGE_ISARRAY, {
      description: '',
    }, [5], { isArray: false });

    expect(result?.field).to.equal(control.displayName);
  });
});