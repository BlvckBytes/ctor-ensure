import { ValidationConfig } from '../../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is not of null value
 */
const ENSURE_NONNULL = (): ValidationConfig => ({
    description: {
      name: 'ENSURE_NONNULL',
    },
    process: (value) => ({
      error: !(value !== null && value !== undefined),
      value,
    }),
  });

export default ENSURE_NONNULL;