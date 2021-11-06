import { ValidationConfig } from '../../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is a valid JS date object
 */
const ENSURE_ISDATE = (): ValidationConfig => ({
    description: {
      name: 'ENSURE_ISDATE',
    },
    process: (value) => ({
      error: !(value instanceof Date && !Number.isNaN(value.getTime())),
      value,
    }),
  });

export default ENSURE_ISDATE;