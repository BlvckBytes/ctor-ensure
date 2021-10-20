import { template } from '..';
import FieldType from '../field-type.enum';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is a boolean value
 */
const ENSURE_BOOLEAN = (): ValidationConfig => ({
    type: FieldType.BOOLEAN,
    description: template('ENSURE_BOOLEAN'),
  });

export default ENSURE_BOOLEAN;