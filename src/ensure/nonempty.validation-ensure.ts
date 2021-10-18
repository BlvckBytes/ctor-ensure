import { template } from '../description-template.factory';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is not empty
 */
const ENSURE_NONEMPTY = (): ValidationConfig => ({
    pattern: /.+/,
    description: template('ENSURE_NONEMPTY'),
  });

export default ENSURE_NONEMPTY;