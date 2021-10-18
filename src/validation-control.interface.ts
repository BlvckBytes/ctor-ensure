import { ValidationConfig } from './validation-config.interface';
import { ValidationFlags } from './validation-flags.interface';

/**
 * Control for {@link ValidatedArg} decorator, validating properties
 */
export interface ValidationControl {
  // Name of the field
  displayName: string;

  // Index of property in constructor arg list
  ctorInd: number;

  // Configurations for validation (chain elements)
  configs: ValidationConfig[];

  // Flags for this control
  flags: ValidationFlags;
}
