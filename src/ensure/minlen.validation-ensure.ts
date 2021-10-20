import { ValidationConfig } from '../validation-config.interface';
import ENSURE_MINMAXLEN from './minmaxlen.validation-ensure';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Constrain the minimum length of a string
 * @param min Minimum length
 */
const ENSURE_MINLEN = (min: number): ValidationConfig => ENSURE_MINMAXLEN(min, -1);

export default ENSURE_MINLEN;
