import { ValidationControl } from '.';

/**
 * Configuration of a validation chain element
 */
export interface ValidationConfig {
  // Description of this validator
  description: (() => string) | string;

  // Callback to process this configuration
  // Returns passing as true and failed as false
  process: (
    value: any, // Value to validate, always scalar
    neighbors: ValidationControl[], // Neighbor validation controls
    ctor: any[], // All constructor arguments
    parent: ValidationControl, // Parent validation control
    arg: any, // Current ctor argument, scalar or array
  ) => boolean;
}
