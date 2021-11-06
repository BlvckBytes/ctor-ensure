import { ValidationConfig } from '../../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is a valid uuid
 */
const ENSURE_STRUUID = (): ValidationConfig => {
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return {
    description: {
      name: 'ENSURE_STRUUID',
    },
    process: (value) => ({
      error: typeof value !== 'string' || !pattern.test(value),
      value,
    }),
  };
};

export default ENSURE_STRUUID;