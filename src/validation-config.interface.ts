import { ValidationControl, ValidationResult } from '.';
import { TemplateParameters } from './description-template.factory';

/**
 * Configuration of a validation chain element
 */
export interface ValidationConfig {
  // Description of this validator
  // Can be either a template, a string thunk or an immediate string value
  description: TemplateParameters | (() => string) | string;

  // Callback to process this configuration
  // Returns passing as true and failed as false
  process: (
    // Value to validate, always scalar
    value: any,

    // Neighbor validation controls
    neighbors: ValidationControl[],

    // All constructor arguments
    ctor: any[],

    // Parent validation control
    parent: ValidationControl,

    // Current ctor argument, scalar or array
    arg: any,

  // Return the value that caused trouble, or null if all passed
  ) => ValidationResult;
}
