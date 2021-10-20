/* eslint-disable no-control-regex */
import { template } from '../description-template.factory';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is only containing ascii characters
 */
const ENSURE_ASCII = (justPrintable = false): ValidationConfig => ({
    pattern: justPrintable ? /^[ -~]*$/ : /^[\x00-\x7F]*$/,
    description: template('ENSURE_ASCII', {
      onlyprint: justPrintable,
    }),
  });

export default ENSURE_ASCII;
