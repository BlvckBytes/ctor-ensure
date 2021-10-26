import { ValidationConfig } from '../../validation-config.interface';
import ENSURE_MINMAXDATE from './minmaxdate.validation-ensure';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Constrain the maximum date of a field
 * @param max Maximum date
 */
const ENSURE_MAXDATE = (max: Date): ValidationConfig => ENSURE_MINMAXDATE(null, max);

export default ENSURE_MAXDATE;
