import CtorEnsureArgError from '../ctor-ensure-arg-error.interface';
import FieldType from '../field-type.enum';
import { evalStrThunk } from '../util';
import { ValidationConfig } from '../validation-config.interface';
import { ValidationControl } from '../validation-control.interface';

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
 * Validates that the field has a certain data-type
 */
export const STAGE_ISTYPE = (
  _controls: ValidationControl[],
  _ctorArgs: any[],
  currConfig: ValidationConfig,
  currControl: ValidationControl,
  _: any,
  currValue: any,
): CtorEnsureArgError | null => {
  // Nothing to validate
  if (!currConfig.type) return null;

  // Check against provided field type
  let isValid = false;
  switch (currConfig.type) {
    case FieldType.UNDEFINED:
      // Cannot be undefined, but null (which is actively stated)
      isValid = currValue === undefined;
      break;

    case FieldType.NULL:
      // Cannot be undefined nor null (most intuitive)
      isValid = currValue === null || currValue === undefined;
      break;

    case FieldType.INT:
      isValid = isInt(currValue);
      break;

    case FieldType.FLOAT:
      isValid = isFloat(currValue);
      break;

    case FieldType.STRING:
      isValid = typeof currValue === 'string';
      break;

    default:
      throw SyntaxError('Unknown fieldtype specified!');
  }

  // Invalid field type, or valid and negated
  if (!isValid !== (currConfig.negate || false))
    return {
      field: currControl.displayName,
      description: evalStrThunk(currConfig.description),
      value: currValue,
    };

  // Passed
  return null;
};
