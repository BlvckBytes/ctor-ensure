import { ValidationConfig } from '../../validation-config.interface';
import { escapeRegExp } from '../../util';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field contains the provided string
 * @param string String that has to be contained inside field
 * @param allow True if the string should contain, false if it shouldn't
 */
const ENSURE_CONTAINS = (string: string, allow = true): ValidationConfig => {
  const pattern = new RegExp(`(${escapeRegExp(string)})`);
  return {
    description: {
      name: 'ENSURE_CONTAINS',
      vars: { 
        str: string,
        allow,
      },
    },
    process: (value) => ({
      error: !(pattern.test(value) === allow),
      value,
    }),
  };
};

export default ENSURE_CONTAINS;