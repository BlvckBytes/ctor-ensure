import CtorEnsureArgError from '../ctor-ensure-arg-error.interface';
import { ValidationConfig } from '../validation-config.interface';
import { ValidationControl } from '../validation-control.interface';
import { ValidationStage } from '../validation-stage.type';

/**
 * Validates that the field's value equals to all provided other fields
 */
const STAGE_ISEQUAL: ValidationStage = (
  controls: ValidationControl[],
  ctorArgs: any[],
  currConfig: ValidationConfig,
  currControl: ValidationControl,
  _: any,
  currValue: any,
): CtorEnsureArgError | null => {
  // Nothing to validate
  if (!currConfig.equalsToFields || currConfig.equalsToFields.length === 0)
    return null;

  // Loop all other fields
  for (let i = 0; i < currConfig.equalsToFields.length; i += 1) {
    const otherFieldName = currConfig.equalsToFields[i];

    // Find current index
    const currCtorInd = controls.find(it => it.displayName === otherFieldName)
      ?.ctorInd;

    // Partner-field not existing
    if (!currCtorInd) {
      throw SyntaxError(
        'Other field to equal must be decorated with used name!',
      );
    }

    // Partner-field mismatched
    // Non-provided field values are ignored
    if (ctorArgs[currCtorInd] !== currValue || currValue === undefined) {
      return {
        field: currControl.displayName,
        description: currConfig.description,
      };
    }
  }

  // All passed
  return null;
};

export default STAGE_ISEQUAL;