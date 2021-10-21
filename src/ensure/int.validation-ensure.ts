import { template } from '..';
import { ValidationConfig } from '../validation-config.interface';

/**
 * Check if the provided value is a valid integer
 * @param value Value to check
 * @returns True if is an integer, false otherwise
 */
export const isInt = (value: any): boolean => {
  // No number
  if (typeof value !== 'number' || Number.isNaN(value))
    return false;

  // Make sure it's an int and no float
  const parsed = Number.parseInt(String(value), 10);
  return !Number.isNaN(parsed) && parsed === value;
};

/**
 * Ensure to be used within config of {@link ValidatedArg}
 * Ensure this field is a number of type integer
 */
export const ENSURE_INT = (): ValidationConfig => ({
    description: template('ENSURE_INT'),
    process: (value) => isInt(value),
  });