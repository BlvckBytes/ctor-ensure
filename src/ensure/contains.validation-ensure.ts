import { template } from '..';
import { escapeRegExp } from '../util';
import { ValidationConfig } from '../validation-config.interface';
import { ValidationEnsure } from '../validation-ensure.type';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field contains the provided string
 * @param str String that has to be contained inside field
 */
const ENSURE_CONTAINS: ValidationEnsure = (str: string): ValidationConfig => ({
    pattern: new RegExp(escapeRegExp(str)),
    description: template('ENSURE_CONTAINS', { str }),
  });

export default ENSURE_CONTAINS;