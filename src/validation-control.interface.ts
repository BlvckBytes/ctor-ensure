import Optionality from './optionality.enum';
import { ValidationConfig } from './validation-config.interface';

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

  // State of optionality
  optional: Optionality;

  // Callback to check whether or not to
  // skip this control's validation
  skipOn?: (
    // Values of constructor, where the key is
    // is field's displayname
    values: { [ key: string ]: any }
  ) => boolean;
}
