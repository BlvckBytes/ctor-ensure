import { FieldType } from '..';
import { template } from '../description-template.factory';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is a string representing a float
 */
const ENSURE_STRFLOAT = (): ValidationConfig => ({
    type: FieldType.STRING,
    pattern: /^[0-9]+\.[0-9]+$/,
    description: template('ENSURE_STRFLOAT'),
  });

export default ENSURE_STRFLOAT;