import { expect } from 'chai';
import { STAGE_ISTYPE } from '../../src';
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
});