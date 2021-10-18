import { ValidationConfig } from '../validation-config.interface';
import ENSURE_MINMAX from './minmax.validation-ensure';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Constrain the minimum length of a string
 * @param min Minimum length
 */
const ENSURE_MIN = (min: number): ValidationConfig => ENSURE_MINMAX(min, -1);

export default ENSURE_MIN;
