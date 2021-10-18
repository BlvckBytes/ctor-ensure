import { template } from '../description-template.factory';
import FieldType from '../field-type.enum';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is not of null value
 */
const ENSURE_NONNULL = (): ValidationConfig => ({
    type: FieldType.NULL,
    negate: true,
    description: template('ENSURE_NONNULL'),
  });

export default ENSURE_NONNULL;