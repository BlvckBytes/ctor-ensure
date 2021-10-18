import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field tests positively against the provided pattern
 * @param pattern Regular expression to use
 * @param description Description of that pattern
 */
const ENSURE_PATTERN = (
  pattern: RegExp,
  description: string | (() => string),
): ValidationConfig => ({
    pattern,
    description,
  });

export default ENSURE_PATTERN;