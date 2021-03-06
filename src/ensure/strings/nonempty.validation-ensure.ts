import { ValidationConfig } from '../../validation-config.interface';

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is not empty
 */
const ENSURE_NONEMPTY = (): ValidationConfig => {
  const pattern = /.+/;
  return {
    description: {
      name: 'ENSURE_NONEMPTY',
    },
    process: (value) => ({
      error: !pattern.test(value),
      value,
    }),
  };
};

export default ENSURE_NONEMPTY;