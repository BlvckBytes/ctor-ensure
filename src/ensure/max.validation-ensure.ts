import { ValidationConfig } from '../validation-config.interface';
import { ValidationEnsure } from '../validation-ensure.type';
import ENSURE_MINMAX from './minmax.validation-ensure';

/**
 * Pattern to be used within config of {@link ValidatedArg}
 * Constrain the maximum length of a string
 * @param max Maximum length
 */
const ENSURE_MAX: ValidationEnsure = (max: number): ValidationConfig => ENSURE_MINMAX(-1, max);

export default ENSURE_MAX;
