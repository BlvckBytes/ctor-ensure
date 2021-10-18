import { template } from '..';
import FieldType from '../field-type.enum';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is a number of type integer
 */
const ENSURE_INT = (): ValidationConfig => ({
    type: FieldType.INT,
    description: template('ENSURE_INT'),
  });

export default ENSURE_INT;