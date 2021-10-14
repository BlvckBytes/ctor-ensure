import { ValidationConfig } from '../validation-config.interface';
import { ValidationEnsure } from '../validation-ensure.type';
import ENSURE_MINMAX from './minmax.validation-ensure';

/**
 * Pattern to be used within config of {@link ValidatedArg}
 * Constrain the minimum length of a string
 * @param min Minimum length
 */
const ENSURE_MIN: ValidationEnsure = (min: number): ValidationConfig => ENSURE_MINMAX(min, -1);

export default ENSURE_MIN;
