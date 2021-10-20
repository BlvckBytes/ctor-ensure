import { template } from '../description-template.factory';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is alphabetical
 * @param allowSpaces Whether or not to allow spaces
 */
const ENSURE_ALPHA = (allowSpaces = true): ValidationConfig => ({
    pattern: allowSpaces ? /[A-Za-z ]+/ : /[A-Za-z]+/,
    description: template('ENSURE_ALPHA', {
      nospaces: !allowSpaces,
    }),
  });

export default ENSURE_ALPHA;
