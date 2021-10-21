import { template } from '../description-template.factory';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is not of null value
 */
const ENSURE_NONNULL = (): ValidationConfig => ({
    description: template('ENSURE_NONNULL'),
    process: (value) => value !== null && value !== undefined,
  });

export default ENSURE_NONNULL;