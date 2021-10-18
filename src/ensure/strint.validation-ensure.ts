import { FieldType, template } from '..';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is a string representing an integer
 */
const ENSURE_STRINT = (): ValidationConfig => ({
    type: FieldType.STRING,
    pattern: /^[0-9]+$/,
    description: template('ENSURE_STRINT'),
  });

export default ENSURE_STRINT;