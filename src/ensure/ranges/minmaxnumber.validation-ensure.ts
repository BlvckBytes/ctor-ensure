import { isFloat, isInt } from '../..';
import { ValidationConfig } from '../../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this number is within a specified range, if it's a number
 * @param min Mininum value (including)
 * @param max Maximum value (including)
 */
const ENSURE_MINMAXNUMBER = (min: number | null, max: number | null): ValidationConfig => {
  if (min === null && max === null)
    throw new SyntaxError('Define at least min or max!');
  if ((min || 0) > (max || 0) && max !== null)
    throw new SyntaxError('Max cannot be less than min!');

  return {
    description: {
      name: 'ENSURE_MINMAXNUMBER',
      vars: {
        min, max,
        hasMin: min !== null,
        hasMax: max !== null,
        hasBoth: min !== null && max !== null,
      },
    },
    process: (value) => ({
      error: (
        // Is not a number
        !(isInt(value) || isFloat(value)) ||
        // And not within specified range
        (
          (max !== null && value > max) ||
          (min !== null && value < min)
        )
      ),
      value,
    }),
  };
};

export default ENSURE_MINMAXNUMBER;

