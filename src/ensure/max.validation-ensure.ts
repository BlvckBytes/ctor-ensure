import { ValidationConfig } from '../validation-config.interface';
import ENSURE_MINMAX from './minmax.validation-ensure';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Constrain the maximum length of a string
 * @param max Maximum length
 */
const ENSURE_MAX = (max: number): ValidationConfig => ENSURE_MINMAX(-1, max);

export default ENSURE_MAX;
