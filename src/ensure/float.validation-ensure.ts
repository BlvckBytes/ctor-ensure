import { template } from '../description-template.factory';
import FieldType from '../field-type.enum';
import { ValidationConfig } from '../validation-config.interface';
import { ValidationEnsure } from '../validation-ensure.type';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is a number of type float
 */
const ENSURE_FLOAT: ValidationEnsure = (): ValidationConfig => ({
    type: FieldType.FLOAT,
    description: template('ENSURE_FLOAT'),
  });

export default ENSURE_FLOAT;