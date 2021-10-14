import { template } from '../description-template.factory';
import { ValidationConfig } from '../validation-config.interface';
import { ValidationEnsure } from '../validation-ensure.type';

const REGEX_ISODATE = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

/**
 * Pattern to be used within config of {@link ValidatedArg}
 * Ensure this field is a valid date string
 */
const ENSURE_STRDATE: ValidationEnsure = (): ValidationConfig => ({
    pattern: REGEX_ISODATE,
    description: template('ENSURE_STRDATE'),
  });

export default ENSURE_STRDATE;