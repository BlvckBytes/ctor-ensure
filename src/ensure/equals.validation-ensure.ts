import { template } from '../description-template.factory';
import { ValidationConfig } from '../validation-config.interface';
import { ValidationEnsure } from '../validation-ensure.type';

/**
 * Pattern to be used within config of {@link ValidatedArg}
 * Ensure this field's content matches with all other provided fields
 * @param fieldName Names of partner fields, need to be registered {@link ValidatedArg}
 */
const ENSURE_EQUALS: ValidationEnsure = (...fieldNames: string[]): ValidationConfig => ({
    equalsToFields: fieldNames,
    description: template('ENSURE_EQUALS', {
      numFields: fieldNames.length,
      fieldNames: fieldNames.join(', '),
    }),
  });

export default ENSURE_EQUALS;