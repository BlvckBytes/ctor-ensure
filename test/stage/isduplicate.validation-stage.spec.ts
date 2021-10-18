import { expect } from 'chai';
import { STAGE_ISDUPLICATE } from '../../src/stage/isduplicate.validation-stage';
import { runStageTesting } from '../test-util';

describe('STAGE_ISDUPLICATE', () => {

  it('should accept no-dup arrays case-sensitive', () => {
    const { result } = runStageTesting(STAGE_ISDUPLICATE, {
      description: '',
    }, ['i', 'am', 'different', 'DiFfErEnT'], { isArray: true, isUnique: true });
    expect(result).to.be.null;
  });

  it('should accept no-dup strings case-sensitive', () => {
    const { result } = runStageTesting(STAGE_ISDUPLICATE, {
      description: '',
    }, 'i am different DiFfErEnT', { isArray: false, isUnique: true });
    expect(result).to.be.null;
  });

  it('shouldn\'t accept dup arrays case-sensitive', () => {
    const { control, result } = runStageTesting(STAGE_ISDUPLICATE, {
      description: '',
    }, ['i', 'am', 'different', 'different'], { isArray: true, isUnique: true });
    expect(result?.field).to.equal(control.displayName);
  });

  it('shouldn\'t accept dup strings case-sensitive', () => {
    const { control, result } = runStageTesting(STAGE_ISDUPLICATE, {
      description: '',
    }, 'i am different different', { isArray: false, isUnique: true });
    expect(result?.field).to.equal(control.displayName);
  });

  it('should accept no-dup arrays case-insensitive', () => {
    const { result } = runStageTesting(STAGE_ISDUPLICATE, {
      description: '',
    }, ['i', 'am', 'different', 'DiFfErEnT'], { isArray: true, isUnique: true });
    expect(result).to.be.null;
  });

  it('shouldn\'t accept dup arrays case-insensitive', () => {
    const { control, result } = runStageTesting(STAGE_ISDUPLICATE, {
      description: '',
    }, ['i', 'am', 'different', 'DiFfErEnT'], { isArray: true, isUnique: true, ignoreCasing: true });
    expect(result?.field).to.equal(control.displayName);
  });

  it('shouldn\'t accept dup strings case-insensitive', () => {
    const { control, result } = runStageTesting(STAGE_ISDUPLICATE, {
      description: '',
    }, 'i am different DiFfErEnT', { isArray: false, isUnique: true, ignoreCasing: true });
    expect(result?.field).to.equal(control.displayName);
  });
});