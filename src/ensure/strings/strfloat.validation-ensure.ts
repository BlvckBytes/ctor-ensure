import { template } from '../../description-template.factory';
import { ValidationConfig } from '../../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is a string representing a float
 */
const ENSURE_STRFLOAT = (): ValidationConfig => {
  const pattern = /(^[0-9]+\.[0-9]+$)|^$/;
  return {
    description: template('ENSURE_STRFLOAT'),
    process: (value) => ({
      error: !(typeof value === 'string' && pattern.test(value)),
      value,
    }),
  };
};

export default ENSURE_STRFLOAT;