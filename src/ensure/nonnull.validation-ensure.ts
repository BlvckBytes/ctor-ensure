import { template } from '../description-template.factory';
import FieldType from '../field-type.enum';
import { ValidationConfig } from '../validation-config.interface';
import { ValidationEnsure } from '../validation-ensure.type';

/**
 * Pattern to be used within config of {@link ValidatedArg}
 * Ensure this field is not of null value
 */
const ENSURE_NONNULL: ValidationEnsure = (): ValidationConfig => ({
    type: FieldType.NULL,
    negate: true,
    description: template('ENSURE_NONNULL'),
  });

export default ENSURE_NONNULL;