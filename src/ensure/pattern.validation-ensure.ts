import { ValidationConfig } from '../validation-config.interface';
import { ValidationEnsure } from '../validation-ensure.type';

/**
 * Pattern to be used within config of {@link ValidatedArg}
 * Ensure this field tests positively against the provided pattern
 */
const ENSURE_PATTERN: ValidationEnsure = (
  pattern: RegExp,
  description: string,
): ValidationConfig => ({
    pattern,
    description,
  });

export default ENSURE_PATTERN;