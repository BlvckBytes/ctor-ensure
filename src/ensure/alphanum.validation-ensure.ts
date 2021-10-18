import { template } from '../description-template.factory';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is alphanumeric
 */
const ENSURE_ALPHANUM = (): ValidationConfig => ({
    pattern: /[A-Za-z0-9 ]+/,
    description: template('ENSURE_ALPHANUM'),
  });

export default ENSURE_ALPHANUM;
