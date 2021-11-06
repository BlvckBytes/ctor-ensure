import { ValidationConfig } from '../../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is alphabetical
 * @param allowSpaces Whether or not to allow spaces
 */
const ENSURE_ALPHA = (allowSpaces = true): ValidationConfig => {
  const pattern = allowSpaces ? /^[A-Za-z ]*$/ : /^[A-Za-z]*$/;
  return {
    description: {
      name: 'ENSURE_ALPHA',
      vars: {
        nospaces: !allowSpaces,
      },
    },
    process: (value) => ({
      error: !pattern.test(value),
      value,
    }),
  };
};

export default ENSURE_ALPHA;
