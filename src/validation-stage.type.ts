import CtorEnsureArgError from './ctor-ensure-arg-error.interface';
import { ValidationConfig } from './validation-config.interface';
import { ValidationControl } from './validation-control.interface';

/**
 * Representing the state of validation-info at a single
 * config within a single control, gets executed for every
 * field or element of field if it's an array
 */
export type ValidationStage = (
  // All controls of model
  controls: ValidationControl[],

  // Arguments of model's constructor
  ctorArgs: any[],

  // Current config of current control
  currConfig: ValidationConfig,

  // Current control of validation-chain
  currControl: ValidationControl,

  // Current argument of constructor
  currArg: any,

  // Current value of current argument, if is an array
  currValue: any
) => CtorEnsureArgError | null;
