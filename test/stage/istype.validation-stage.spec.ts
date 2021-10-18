import { expect } from 'chai';
import { STAGE_ISTYPE } from '../../src';
import { isFloat, isInt } from '../../src/stage/istype.validation-stage';
import { runStageTesting } from '../test-util';

describe('STAGE_ISTYPE', () => {

  it('should throw on unknown field types', () => {
    // Make call with invalid type
    const call = () => runStageTesting(STAGE_ISTYPE, {
      type: 8192,
      description: 'invalid type',
    }, '');

    // Should throw an error
    expect(call).to.throw('Unknown fieldtype specified!');
  });

  it('should have working isInt()', () => {
    expect(isInt('5')).to.equal(false);
    expect(isInt('5.5')).to.equal(false);
    expect(isInt(5.5)).to.equal(false);
    expect(isInt(5)).to.equal(true);
  });

  it('should have working isFloat()', () => {
    expect(isFloat('5')).to.equal(false);
    expect(isFloat('5.5')).to.equal(false);
    expect(isFloat(5)).to.equal(true);
    expect(isFloat(5.5)).to.equal(true);
  });
});