import { ValidationConfig } from '../../validation-config.interface';
import ENSURE_MINMAXNUMBER from './minmaxnumber.validation-ensure';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Constrain the maximum value of a number
 * @param max Maximum value
 */
const ENSURE_MAXNUMBER = (max: number): ValidationConfig => ENSURE_MINMAXNUMBER(null, max);

export default ENSURE_MAXNUMBER;


