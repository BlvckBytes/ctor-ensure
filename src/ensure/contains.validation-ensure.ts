import { template } from '..';
import { escapeRegExp } from '../util';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field contains the provided string
 * @param string String that has to be contained inside field
 * @param allow True if the string should contain, false if it shouldn't
 */
const ENSURE_CONTAINS = (string: string, allow = true): ValidationConfig => ({
    pattern: new RegExp(`(${escapeRegExp(string)})`),
    negate: !allow,
    description: template('ENSURE_CONTAINS', { str: string }),
  });

export default ENSURE_CONTAINS;