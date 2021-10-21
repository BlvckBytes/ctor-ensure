/* eslint-disable no-control-regex */
import { template } from '../description-template.factory';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is only containing ascii characters
 * @param justPrintable Whether or not to just allow visible characters
 * @param allowSpaces Whether or not to allow spaces
 */
const ENSURE_ASCII = (justPrintable = false, allowSpaces = true): ValidationConfig => {
  // eslint-disable-next-line no-nested-ternary
  const pattern = justPrintable ? (allowSpaces ? /^[ -~]*$/ : /^[!-~]*$/) : (allowSpaces ? /^[\x00-\x7F]*$/ : /^[\x00-\x1F\x21-\x7F]*$/);
  return {
    description: template('ENSURE_ASCII', {
      onlyprint: justPrintable,
      nospaces: !allowSpaces,
    }),
    process: (value) => pattern.test(value),
  };
};

export default ENSURE_ASCII;
