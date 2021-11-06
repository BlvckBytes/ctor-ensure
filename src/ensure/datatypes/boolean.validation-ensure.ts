import { ValidationConfig } from '../../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is a boolean value
 */
const ENSURE_BOOLEAN = (): ValidationConfig => ({
    description: {
      name: 'ENSURE_BOOLEAN',
    },
    process: (value) => ({
      error: typeof value !== 'boolean',
      value,
    }),
  });

export default ENSURE_BOOLEAN;