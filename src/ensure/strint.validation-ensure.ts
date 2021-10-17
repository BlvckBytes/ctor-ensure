import { template } from '..';
import { ValidationConfig } from '../validation-config.interface';
import { ValidationEnsure } from '../validation-ensure.type';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is a string representing an integer
 */
const ENSURE_STRINT: ValidationEnsure = (): ValidationConfig => ({
    pattern: /^[0-9]+$/,
    description: template('ENSURE_STRINT'),
  });

export default ENSURE_STRINT;