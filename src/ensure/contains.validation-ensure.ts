import { template } from '..';
import { escapeRegExp } from '../util';
import { ValidationConfig } from '../validation-config.interface';
import { ValidationEnsure } from '../validation-ensure.type';

/**
 * Pattern to be used within config of {@link ValidatedArg}
 * Ensure this field is a number of type integer
 */
const ENSURE_CONTAINS: ValidationEnsure = (str: string): ValidationConfig => ({
    pattern: new RegExp(escapeRegExp(str)),
    description: template('ENSURE_CONTAINS', { str }),
  });

export default ENSURE_CONTAINS;