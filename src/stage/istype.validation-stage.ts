import CtorEnsureArgError from '../ctor-ensure-arg-error.interface';
import FieldType from '../field-type.enum';
import { evalStrThunk } from '../util';
import { ValidationConfig } from '../validation-config.interface';
import { ValidationControl } from '../validation-control.interface';
import { ValidationStage } from '../validation-stage.type';

/**
 * Check if the provided value is a valid integer
 * @param value Value to check
 * @returns True if is an integer, false otherwise
 */
export const isInt = (value: any): boolean => !Number.isNaN(value) && !Number.isNaN(parseInt(value, 10));

/**
 * Check if the provided value is a valid float
 * @param value Value to check
 * @returns True if is a float, false otherwise
 */
export const isFloat = (value: any): boolean => !Number.isNaN(value) && !Number.isNaN(parseFloat(value));

/**
 * Validates that the field has a certain data-type
 */
export const STAGE_ISTYPE: ValidationStage = (
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
      isValid = currValue === undefined;
      break;

    case FieldType.NULL:
      isValid = currValue === null;
      break;

    case FieldType.INT:
      isValid = isInt(currValue) && typeof currValue === 'number';
      break;

    case FieldType.FLOAT:
      isValid = isFloat(currValue) && typeof currValue === 'number';
      break;

    default:
      throw SyntaxError('Unknown fieldtype specified!');
  }

  // Invalid field type
  if (!isValid !== (currConfig.negate || false))
    return {
      field: currControl.displayName,
      description: evalStrThunk(currConfig.description),
    };

  // Passed
  return null;
};
