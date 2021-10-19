import { template } from '..';
import CtorEnsureArgError from '../ctor-ensure-arg-error.interface';
import { ValidationConfig } from '../validation-config.interface';
import { ValidationControl } from '../validation-control.interface';

/**
 * Validates that the field is of type array
 */
const STAGE_ISARRAY = (
  _controls: ValidationControl[],
  _ctorArgs: any[],
  _currConfig: ValidationConfig,
  currControl: ValidationControl,
  currArg: any,
): CtorEnsureArgError | null => {
  // Check if the data isn't in the required array-shape
  if (currControl.flags.isArray !== Array.isArray(currArg)) {
    return {
      field: currControl.displayName,
      description: template('STAGE_ISARRAY'),
      value: currArg,
    };
  }

  // Passed
  return null;
};

export default STAGE_ISARRAY;