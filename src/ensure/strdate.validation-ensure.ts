import { template } from '../description-template.factory';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is a valid date string
 */
const ENSURE_STRDATE = (): ValidationConfig => {
  const pattern = /(^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$)|^$/i;
  return {
    description: template('ENSURE_STRDATE'),
    process: (value) => ({
      error: !pattern.test(value),
      value,
    }),
  };
};

export default ENSURE_STRDATE;