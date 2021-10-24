import { template } from '../description-template.factory';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is alphanumeric
 * @param allowSpaces Whether or not to allow spaces
 */
const ENSURE_ALPHANUM = (allowSpaces = true): ValidationConfig => {
  const pattern = allowSpaces ? /^[A-Za-z0-9 ]*$/ : /^[A-Za-z0-9]*$/;
  return {
    description: template('ENSURE_ALPHANUM', {
      nospaces: !allowSpaces,
    }),
    process: (value) => ({
      error: !pattern.test(value),
      value,
    }),
  };
};

export default ENSURE_ALPHANUM;
