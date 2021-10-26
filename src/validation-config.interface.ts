import { ValidationControl, ValidationResult } from '.';

/**
 * Configuration of a validation chain element
 */
export interface ValidationConfig {
  // Description of this validator
  description: (() => string) | string;

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
