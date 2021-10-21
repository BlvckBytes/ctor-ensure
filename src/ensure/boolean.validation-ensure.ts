import { template } from '..';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is a boolean value
 */
const ENSURE_BOOLEAN = (): ValidationConfig => ({
    description: template('ENSURE_BOOLEAN'),
    process: (value) => typeof value === 'boolean',
  });

export default ENSURE_BOOLEAN;