import { ValidationConfig } from '../../validation-config.interface';
import ENSURE_MINMAXNUMBER from './minmaxnumber.validation-ensure';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Constrain the minimum value of a number
 * @param min Minimum value
 */
const ENSURE_MINNUMBER = (min: number): ValidationConfig => ENSURE_MINMAXNUMBER(min, null);

export default ENSURE_MINNUMBER;

