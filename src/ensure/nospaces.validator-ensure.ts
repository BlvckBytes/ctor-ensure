import { template } from '../description-template.factory';
import { ValidationConfig } from '../validation-config.interface';
import { ValidationEnsure } from '../validation-ensure.type';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field contains no spaces
 */
const ENSURE_NOSPACES: ValidationEnsure = (): ValidationConfig => ({
    pattern: /[^ ]*/,
    description: template('ENSURE_NOSPACES'),
  });

export default ENSURE_NOSPACES;
