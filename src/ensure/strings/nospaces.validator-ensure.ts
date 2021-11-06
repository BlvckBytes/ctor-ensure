import { ValidationConfig } from '../../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field contains no spaces
 */
const ENSURE_NOSPACES = (): ValidationConfig => {
  const pattern = /^[^ ]*$/;
  return {
    description: {
      name: 'ENSURE_NOSPACES',
    },
    process: (value) => ({
      error: !pattern.test(value),
      value,
    }),
  };
};

export default ENSURE_NOSPACES;
