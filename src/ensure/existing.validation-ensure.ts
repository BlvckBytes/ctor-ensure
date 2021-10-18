import { template } from '../description-template.factory';
import FieldType from '../field-type.enum';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field has a defined value
 */
const ENSURE_EXISTING = (): ValidationConfig => ({
    type: FieldType.UNDEFINED,
    negate: true,
    description: template('ENSURE_EXISTING'),
  });

export default ENSURE_EXISTING;