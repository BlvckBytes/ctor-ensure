import { ValidationConfig } from '../../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field has a min and max length, if it's an array, ignore otherwise
 * @param min Mininum amount of elements inside array
 * @param max Maximum amount of elements inside array
 */
const ENSURE_ARRAYSIZE = (min: number, max: number): ValidationConfig => {
  if (min < 0 && max < 0)
    throw new SyntaxError('Define at least min or max!');
  if (min > max && max !== -1)
    throw new SyntaxError('Max cannot be less than min!');

  return {
    description: { 
      name: 'ENSURE_ARRAYSIZE',
      vars: {
        min,
        max,
        hasMin: min > 0,
        hasMax: max > 0,
        hasBoth: min > 0 && max > 0,
      },
    },
    process: (_value, _neighbors, _ctor, _parent, arg) => ({
      error: (
        // Is not an array
        !Array.isArray(arg) ||

        // or not within specified range
        (
          (arg.length < min && min > 0) ||
          (arg.length > max && max > 0)
        )
      ),
      value: arg,
    }),
  };
};

export default ENSURE_ARRAYSIZE;
