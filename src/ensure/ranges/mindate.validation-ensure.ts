import { ValidationConfig } from '../../validation-config.interface';
import ENSURE_MINMINDATE from './minmaxdate.validation-ensure';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Constrain the minimum date of a field
 * @param min Minimum date
 */
const ENSURE_MINDATE = (min: Date): ValidationConfig => ENSURE_MINMINDATE(min, null);

export default ENSURE_MINDATE;
