import { template } from '../description-template.factory';
import { ValidationConfig } from '../validation-config.interface';
import { ValidationEnsure } from '../validation-ensure.type';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is not empty
 */
const ENSURE_NONEMPTY: ValidationEnsure = (): ValidationConfig => ({
    pattern: /.+/,
    description: template('ENSURE_NONEMPTY'),
  });

export default ENSURE_NONEMPTY;