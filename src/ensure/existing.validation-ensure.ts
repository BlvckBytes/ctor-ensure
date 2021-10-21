import { template } from '../description-template.factory';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field has a defined value
 */
const ENSURE_EXISTING = (): ValidationConfig => ({
    description: template('ENSURE_EXISTING'),
    process: (value) => value !== undefined,
  });

export default ENSURE_EXISTING;