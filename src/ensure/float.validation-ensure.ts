import { template } from '../description-template.factory';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Check if the provided value is a valid float
 * @param value Value to check
 * @returns True if is a float, false otherwise
 */
export const isFloat = (value: any): boolean => {
  // No number
  if (typeof value !== 'number' || Number.isNaN(value))
    return false;
  const parsed = Number.parseFloat(String(value));

  // Make sure it's a float and no int
  return !Number.isNaN(parsed) && parsed === value;
};

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is a number of type float
 */
export const ENSURE_FLOAT = (): ValidationConfig => ({
    description: template('ENSURE_FLOAT'),
    process: (value) => ({
      error: !isFloat(value),
      value,
    }),
  });