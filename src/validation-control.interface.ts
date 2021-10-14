import { ValidationConfig } from './validation-config.interface';

/**
 * Control for {@link ValidatedArg} decorator, validating properties
 */
export interface ValidationControl {
  // Is an array of elements
  isArray: boolean;

  // Name of the field
  displayName: string;

  // Index of property in constructor arg list
  ctorInd: number;

  // Configurations for validation (chain elements)
  configs: ValidationConfig[];
}
