import CtorEnsureArgError from '../ctor-ensure-arg-error.interface';
import { evalStrThunk } from '../util';
import { ValidationConfig } from '../validation-config.interface';
import { ValidationControl } from '../validation-control.interface';

/**
 * Validates that the value matches a certain pattern
 */
const STAGE_ISPATTERN = (
  _controls: ValidationControl[],
  _ctorArgs: any[],
  currConfig: ValidationConfig,
  currControl: ValidationControl,
  _: any,
  currValue: any,
): CtorEnsureArgError | null => {
  // Nothing to validate
  if (!currConfig.pattern) return null;

  // Validate pattern
  if (
    currValue === null ||
    currValue === undefined ||
    !currConfig.pattern.test(currValue) !== (currConfig.negate || false)
  )
    return {
      field: currControl.displayName,
      description: evalStrThunk(currConfig.description),
      value: currValue,
    };

  // Passed
  return null;
};

export default STAGE_ISPATTERN;