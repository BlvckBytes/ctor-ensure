import { template } from '..';
import { ValidationConfig } from '../validation-config.interface';
import { ValidationEnsure } from '../validation-ensure.type';

export const REGEX_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Pattern to be used within config of {@link ValidatedArg}
 * Ensure this field is a valid uuid
 */
export const ENSURE_STRUUID: ValidationEnsure = (): ValidationConfig => ({
    pattern: REGEX_UUID,
    description: template('ENSURE_STRUUID'),
  });
