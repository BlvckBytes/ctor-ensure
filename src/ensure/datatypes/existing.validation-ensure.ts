import { ValidationConfig } from '../../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field has a defined value
 */
const ENSURE_EXISTING = (): ValidationConfig => ({
    description: {
      name: 'ENSURE_EXISTING',
    },
    process: (value) => ({
      error: value === undefined,
      value,
    }),
  });

export default ENSURE_EXISTING;