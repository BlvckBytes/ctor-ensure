import { expect } from 'chai';
import { STAGE_ISEQUAL } from '../../src';

describe('STAGE_ISEQUAL', () => {
  // Object fields
  const fields = {
    first: 'hello',
    second: 'hello',
    third: 'hello',
    different: 'world',
  };

  // Create control with name and index for every member
  const controls = Object.keys(fields).map((it, ind) => ({
      flags: {
        isArray: false,
        isUnique: false,
        ignoreCasing: false,
      },
      displayName: it,
      ctorInd: ind,
      configs: [],
    }));

  const values = Object.values(fields);

  it('should allow equal values', () => {
    const currField = 0;

    // Testing currField (first) against second and third
    const result = STAGE_ISEQUAL(controls, values, {
      equalsToFields: ['second', 'third'],
      description: '',
    }, controls[currField], values[currField], values[currField]);

    // No errors
    expect(result).to.be.null;
  });

  it('shouldn\'t allow different values', () => {
    const currField = 0;

    // Testing currField (first) against second and different
    const result = STAGE_ISEQUAL(controls, values, {
      equalsToFields: ['second', 'different'],
      description: '',
    }, controls[currField], values[currField], values[currField]);

    // Current field should error
    expect(result?.field).to.equal(controls[currField].displayName);
  });

  it('should throw on unknown other field', () => {
    const currField = 0;

    // Testing currField (first) against second and an unregistered field
    const call = () => STAGE_ISEQUAL(controls, values, {
      equalsToFields: ['second', 'unregistered field here'],
      description: '',
    }, controls[currField], values[currField], values[currField]);

    // Current field should error
    expect(call).to.throw('Other field to equal must be decorated with used name!');
  });
});