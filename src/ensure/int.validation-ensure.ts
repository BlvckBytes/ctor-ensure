import { template } from '..';
import FieldType from '../field-type.enum';
import { ValidationConfig } from '../validation-config.interface';
import { ValidationEnsure } from '../validation-ensure.type';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is a number of type integer
 */
const ENSURE_INT: ValidationEnsure = (): ValidationConfig => ({
    type: FieldType.INT,
    description: template('ENSURE_INT'),
  });

export default ENSURE_INT;