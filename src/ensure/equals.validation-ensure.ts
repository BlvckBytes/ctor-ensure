import { template } from '../description-template.factory';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field's content matches with all other provided fields
 * @param fieldName Names of partner fields, need to be registered {@link ValidatedArg}
 */
const ENSURE_EQUALS = (...fieldNames: string[]): ValidationConfig => ({
    description: template('ENSURE_EQUALS', {
      numFields: fieldNames.length,
      fieldNames: fieldNames.join(', '),
    }),
    process: (value, neighbors, ctor) => {
      for (let i = 0; i < fieldNames.length; i += 1) {
        const name = fieldNames[i];
        const index = neighbors.find(it => it.displayName === name)?.ctorInd;

        // Partner-field not existing
        if (!index) throw SyntaxError('Unknown field requested!');

        // Partner-field mismatched
        if (ctor[index] !== value || value === undefined)
          return false;
      }
      // All passed
      return true;
    },
  });

export default ENSURE_EQUALS;