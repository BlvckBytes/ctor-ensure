import { ValidationConfig } from '../validation-config.interface';
import { ValidationEnsure } from '../validation-ensure.type';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field tests positively against the provided pattern
 * @param pattern Regular expression to use
 * @param description Description of that pattern
 */
const ENSURE_PATTERN: ValidationEnsure = (
  pattern: RegExp,
  description: string | (() => string),
): ValidationConfig => ({
    pattern,
    description,
  });

export default ENSURE_PATTERN;