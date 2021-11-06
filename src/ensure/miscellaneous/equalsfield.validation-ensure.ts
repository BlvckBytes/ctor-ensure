import { ValidationConfig } from '../../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field's content matches with all other provided fields
 * @param positive Whether or not it should match or mismatch (allow-/block)
 * @param fieldName Names of partner fields, need to be registered {@link ValidatedArg}
 */
const ENSURE_EQUALSFIELD = (positive: boolean, ...fieldNames: string[]): ValidationConfig => ({
    description: {
      name: 'ENSURE_EQUALSFIELD' ,
      vars: {
        numFields: fieldNames.length,
        fieldNames: fieldNames.join(', '),
        disallow: !positive,
      },
    },
    process: (value, neighbors, ctor) => {
      for (let i = 0; i < fieldNames.length; i += 1) {
        const name = fieldNames[i];
        const index = neighbors.find(it => it.displayName === name)?.ctorInd;

        // Partner-field not existing
        if (!index) throw SyntaxError('Unknown field requested!');

        // Partner-field mismatched
        const curr = ctor[index];
        if (positive ? (curr !== value || value === undefined) : (curr === value))
          return { error: true, value };
      }

      // All passed
      return { error: false };
    },
  });

export default ENSURE_EQUALSFIELD;