import { template } from '../description-template.factory';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is an array of values
 * @param positive True if should be an array, false otherwise
 * @param unique Whether or not the array values have to be unique
 * @param ignoreCase Whether or not to ignore casing on compare
 */
const ENSURE_ISARRAY = (positive = true, unique = false, ignoreCase = false): ValidationConfig => ({
    description: template('ENSURE_ISARRAY', {
      positive, unique, ignoreCase,
    }),
    process: (_value, _neighbors, _ctor, _parent, arg) => {
      // Not the desired datastructure
      if (!(Array.isArray(arg) === positive)) return { error: true, value: arg };

      // Check if it's unique, only if it's an array
      if (positive && unique) {
        const seen: any[] = [];
        for (let i = 0; i < arg.length; i += 1) {
          let curr = arg[i];

          // Ignorecase of course only works with strings
          if (ignoreCase) curr = String(curr).toLowerCase();

          // Duplicate value
          if (seen.includes(curr)) return { error: true, value: arg[i] };
          seen.push(curr);
        }
      }

      // Validation passed
      return { error: false };
    },
  });

export default ENSURE_ISARRAY;
