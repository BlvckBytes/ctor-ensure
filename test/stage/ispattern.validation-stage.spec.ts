import { expect } from 'chai';
import { STAGE_ISPATTERN } from '../../src';
import { runStageTesting } from '../test-util';

describe('STAGE_ISPATTERN', () => {
  it('should not create errors on undefined patterns', () => {
    // Call pattern stage with no pattern
    const { result } = runStageTesting(STAGE_ISPATTERN, {
      pattern: undefined, // "Verbose", would be implicitly undefined
      description: 'null-pattern',
    }, '');

    // Shouldn't provide errors
    expect(result).to.equal(null);
  });
});