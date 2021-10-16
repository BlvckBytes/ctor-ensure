import { template } from '../description-template.factory';
import { ValidationConfig } from '../validation-config.interface';
import { ValidationEnsure } from '../validation-ensure.type';

/**
 * Pattern to be used within config of {@link ValidatedArg}
 * Constrain the length of a string
 * @param min Minimum length
 * @param max Maximum length
 */
const ENSURE_MINMAX: ValidationEnsure = (min: number, max: number): ValidationConfig => {
  if (min < 0 && max < 0) throw new SyntaxError('Invalid arguments');
  return {
    pattern: new RegExp(`^.{${min > 0 ? min : ''},${max > 0 ? max : ''}}$`),
    description: template('ENSURE_MINMAX', {
      min, max, hasMin: min > 0, hasMax: max > 0, hasBoth: min > 0 && max > 0,
    }),
  };
};

export default ENSURE_MINMAX;