import { template } from '../description-template.factory';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Constrain the length of a string
 * @param min Minimum length
 * @param max Maximum length
 */
const ENSURE_MINMAXLEN = (min: number, max: number): ValidationConfig => {
  if (min < 0 && max < 0)
    throw new SyntaxError('Define at least min or max!');
  if (min > max && max !== -1)
    throw new SyntaxError('Max cannot be less than min!');

  const pattern = new RegExp(`^.{${min > 0 ? min : 0},${max > 0 ? max : ''}}$`);

  return {
    description: template('ENSURE_MINMAXLEN', {
      min, max, hasMin: min > 0, hasMax: max > 0, hasBoth: min > 0 && max > 0,
    }),
    process: (value) => pattern.test(value),
  };
};

export default ENSURE_MINMAXLEN;