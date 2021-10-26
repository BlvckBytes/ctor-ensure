import { template } from '../../description-template.factory';
import { ValidationConfig } from '../../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field's date value is within a specified range
 * @param min Mininum date (including)
 * @param max Maximum date (including)
 */
const ENSURE_MINMAXDATE = (min: Date | null, max: Date | null): ValidationConfig => {
  const minStamp = min?.getTime() || -1;
  const maxStamp = max?.getTime() || -1; 

  if (minStamp === -1 && maxStamp === -1)
    throw new SyntaxError('Define at least min or max!');
  if (minStamp > maxStamp && maxStamp !== -1)
    throw new SyntaxError('Max cannot be less than min!');

  return {
    description: template('ENSURE_MINMAXDATE', {
      min: min?.toISOString(),
      max: max?.toISOString(),
      hasMin: minStamp > -1,
      hasMax: maxStamp > -1,
      hasBoth: minStamp > -1 && maxStamp > -1,
    }),
    process: (value) => ({
      error: (
        // Isn't a date
        !(value instanceof Date) ||
        // or not within specified range
        (
          (value.getTime() > maxStamp && maxStamp > -1) ||
          (value.getTime() < minStamp && minStamp > -1)
        )
      ),
      value,
    }),
  };
};

export default ENSURE_MINMAXDATE;
