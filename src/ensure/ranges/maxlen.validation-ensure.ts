import { ValidationConfig } from '../../validation-config.interface';
import ENSURE_MINMAXLEN from './minmaxlen.validation-ensure';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Constrain the maximum length of a string
 * @param max Maximum length
 */
const ENSURE_MAXLEN = (max: number): ValidationConfig => ENSURE_MINMAXLEN(-1, max);

export default ENSURE_MAXLEN;
