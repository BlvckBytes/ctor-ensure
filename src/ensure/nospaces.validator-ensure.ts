import { template } from '../description-template.factory';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field contains no spaces
 */
const ENSURE_NOSPACES = (): ValidationConfig => ({
    pattern: /^[^ ]*$/,
    description: template('ENSURE_NOSPACES'),
  });

export default ENSURE_NOSPACES;
